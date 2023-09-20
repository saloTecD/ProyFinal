import { Router } from "express";
import passport from "../auth/passport.config.js"
import productManager from "../services/dao/productManagerDB.js"
import {viewGetProducts,/* viewGetProductsLimit, */viewUsersAdmin,viewChat,viewListCartProd,viewLogin,postLogin,viewRegistro,postRegistro,viewLogout,viewPurchase,viewRestablecerContrasena,postRestablecerContrasena,viewResetPass, newPass} from "../controllers/views.controller.js"
import identity from "../auth/userID.js";
import { adminRol,userRol,valid } from "../auth/rolValidator.js";
import config from "../utils/config.js";
const baseLink=config.RAILWAY_LINK
const pManager = new productManager()
const viewRoutes=(store)=>{
    const router=Router()

    router.get("/realtimeProducts",viewGetProducts)
    router.get(`/`, async (req, res) => {
        store.get(req.sessionID, async (err, data) => {
            
            if (data !== null && (req.session.userValidated || req.sessionStore.userValidated)) {
                let limit = parseInt(req.query.limit) || 10
                let page = parseInt(req.query.page) || 1
                let category = (req.query.category) || false
                let status = (req.query.status) || false
                let sort = (req.query.sort) == "asc" ? 1 : (req.query.sort) == "desc" ? -1 : false
                let filter = { limit: limit, page: page, category: category, status: status, sort: sort }
                let regex = new RegExp(/page=[0-9]+$/)
                let newNextLink
                const categorySearch=await pManager.categorySearch()
                const process = await pManager.getProductsLimit(filter)
                let prevLink = process.hasPrevPage == false ? null : process.page - 1
                let nextLink = process.hasNextPage == false ? null : process.page + 1
                let newPrevUrl = prevLink == null ? null : baseLink + req.url.replace(/page=[0-9]+$/, `page=${prevLink}`)
                let logo = req.session.usuario
                let rol = req.session.rol
                if (regex.test(req.url)) {
                    newNextLink = nextLink == null ? null : baseLink + req.url.replace(/page=[0-9]+$/, `page=${nextLink}`)
                } else {
                    newNextLink = nextLink == null ? null : `${baseLink}` + req.url + "?page=2"
                }

                process.prevLink = newPrevUrl
                process.nextLink = newNextLink
                
                console.log(categorySearch)
                res.render("products", { showProducts: process, logo: logo, rol: rol,baseLink:baseLink,categorySearch})
            } else {
                res.render("login")
            }
        })


    })
    router.get("/chat",userRol,viewChat)
    router.get("/carts/:cid",userRol,viewListCartProd)
    router.get("/login",viewLogin)
    router.post("/login",passport.authenticate("login",{failureRedirect:"/login",failureMessage:"Usuario o clave invalidos"}),identity,postLogin)
    router.get("/registro",viewRegistro)
    router.post("/registro",passport.authenticate("register",{failureRedirect:"/registro",failureMessage:"Este Email ya esta registrado"}),postRegistro)
    router.get("/logout",viewLogout)
    router.get("/carts/:cid/purchase",viewPurchase)
    router.get("/restablecercontrasena",viewRestablecerContrasena)
    router.post("/restablecercontrasena",postRestablecerContrasena)
    router.get("/restablecercontrasena/:link",viewResetPass)
    router.post("/newpass",newPass)
    router.get("/users",adminRol,viewUsersAdmin)
    return router
}

export default viewRoutes
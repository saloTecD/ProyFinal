import config from "../utils/config.js";
import productManager from "../services/dao/productManagerDB.js"
import cartManager from "../services/dao/cartManagerDB.js"
import userManager from "../services/dao/userManager.js"
import passport from "../auth/passport.config.js"
import { addLogger } from "../services/logger.service.js";
import { generateRandomLink, sendMail, validateLink } from "../services/email.service.js";
import userDTO from "../services/userDTO.js"
const adminUser = config.ADMIN_USER
const adminPass = config.ADMIN_PASS
const baseLink=config.RAILWAY_LINK

const pManager = new productManager()
const cManager = new cartManager()
const uManager = new userManager()

export const viewGetProducts = async (req, res) => {
    let productos = []
    productos = await pManager.getProducts()
    return res.render("realTimeProducts", { showProducts: productos })
}

export const viewChat = async (req, res) => {
    res.render("chat", {})
}

export const viewListCartProd = async (req, res) => {
    let cid = req.session.pCart
    let products = []
    let logo = req.session.usuario
    let rol = req.session.rol
    products = await cManager.listCartProducts(cid)

    res.render("cart", { showProducts: products, logo:logo,rol:rol,baseLink:baseLink })
}

export const viewLogin = async (req, res) => {
    let msg = req.query.msg
    let msg2 = req.session.messages === undefined ? null : req.session.messages[0]
    delete req.session.messages
    res.render("login", { msg: msg, msg2: msg2,baseLink:baseLink })
}

export const postLogin = async (req, res) => {
    const { userEmail, userPassword } = req.body
    if (userEmail === adminUser && userPassword === adminPass) {
        req.session.userValidated = req.sessionStore.userValidated = true
        req.session.errorMessage = req.sessionStore.errorMessage = ""
        res.redirect(`${baseLink}`)
    } else {
        const user = await uManager.validateUser(userEmail, userPassword)
        req.session.userValidated = req.sessionStore.userValidated = true
        req.session.errorMessage = req.sessionStore.errorMessage = ""
        const userUpdate=await uManager.updateLastConnection(userEmail)
        res.redirect(`${baseLink}`)
    }
}

export const viewRegistro = async (req, res) => {
    let msg = req.session.messages === undefined ? null : req.session.messages[0]
    res.render("register", { msg: msg ,baseLink:baseLink})
}

export const postRegistro = async (req, res) => {
    let user
    const nUser = req.body
    user = await uManager.createUser(nUser)

    if (!user) {
        res.render("register", { msg: "El email ingresado ya se encuentra registrado" })
    } else {
        res.redirect(`${baseLink}/login?msg=Usuario%20Creado%20Con%20Exito`)
    }
}

export const viewLogout = async (req, res) => {
    const userLogOut=req.session.usuario
    console.log("**********************" + req.session.usuario)
    req.session.userValidated = req.session.userValidated = false
    req.session.destroy((err) => {
        req.sessionStore.destroy(req.sessionID, (err) => {
            if (err) console.log(`Error al destruir la sesion (${err})`)
            console.log("sesion destruida")

        })
    })
    req.logger.warn(`${new Date().toLocaleDateString()}: Usuario cerro Sesion - ${req.url}`)
    const userUpdate=await uManager.updateLastConnection(userLogOut)
    res.redirect(`${baseLink}`)
}

export const viewPurchase=async(req,res)=>{
    let cid = req.session.pCart
    let logo = req.session.usuario
    let rol = req.session.rol
    let products = []
    products = await cManager.listPurchase(cid)
    console.log(`Resumen der compra:           ${JSON.stringify(products)}`)
    res.render("purchase", { showProducts: products.prod, logo:logo,rol:rol,total:products.total,baseLink:baseLink })
}

export const viewRestablecerContrasena=async(req,res)=>{
    res.render("restcontrasena",{baseLink:baseLink})
}
export const postRestablecerContrasena=async(req,res)=>{
    const userEmail=req.body.userEmail
    const user=await uManager.validateUser(userEmail,"xx")
    if (user==="Usuario no existe"){
       res.render("login",{msg:"Este usuario no se encuentra registrado"})
    }
    else{
        const result=await generateRandomLink(userEmail)
        res.render("login",{msg:"Se ha enviado el link para restablecer la contraseña"})}
}
export const viewResetPass=async(req,res)=>{
    let link=req.params.link
    let validLink=await validateLink(link)
    if(validLink===null){
        res.render("restcontrasena",{msg:"el link al que intentas acceder no existe o expiro, genera uno nuevo"})
    }
    else{
        res.render("newpass",{msg:link,baseLink:baseLink})
    }
    
}
export const newPass=async(req,res)=>{
    const {userPassword,userLink}=req.body
    let validLink=await validateLink(userLink)
    if(validLink===null){
        res.render("restcontrasena",{msg:"el link al que intentas acceder no existe o expiro, genera uno nuevo"})
    }else{
        const updatedPass=await uManager.updateUserPass(validLink.userEmail,userPassword)

        console.log(updatedPass)
        if(updatedPass==="No se puede usar la misma contraseña"){
            res.render("newpass",{msg2:"No se puede usar la misma contraseña",msg:userLink})
        }else{
            res.render("login",{msg:"Contraseña Actualizada"})
        }
    }
 }
 export const viewUsersAdmin=async(req,res)=>{
    let users=await uManager.getUsersList()
    let newResult=[]
    for (const elem of users){
        if(elem._id!="64a4386586d270d35fe0ca49"){
        newResult.push(elem)}
    }
    return res.render("viewUsersAdmin",{showUsers:newResult})
 }
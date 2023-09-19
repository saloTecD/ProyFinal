import productManager from "../services/dao/productManagerDB.js"
import CustomError from "../services/customError.js";
import errorsDict from "../utils/errorDictionary.js"
import { sendEmailProductDelete } from "../services/email.service.js";
const pManager = new productManager()
const camposObligatorios = ["title", "description", "code", "price", "status", "stock", "category"]

export const getProducts = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10
        let page = parseInt(req.query.page) || 1
        let category = (req.query.category) || false
        let status = (req.query.status) || false
        let sort = (req.query.sort) == "asc" ? 1 : (req.query.sort) == "desc" ? -1 : false
        let filter = { limit: limit, page: page, category: category, status: status, sort: sort }
        let regex = new RegExp(/page=[0-9]+$/)
        let newNextLink
        const process = await pManager.getProductsLimit(filter)
        let prevLink = process.hasPrevPage == false ? null : process.page - 1
        let nextLink = process.hasNextPage == false ? null : process.page + 1
        let newPrevUrl = prevLink == null ? null : "localhost:8080/api" + req.url.replace(/page=[0-9]+$/, `page=${prevLink}`)

        if (regex.test(req.url)) {
            newNextLink = nextLink == null ? null : "localhost:8080/api" + req.url.replace(/page=[0-9]+$/, `page=${nextLink}`)
        } else {
            newNextLink = nextLink == null ? null : "localhost:8080/api" + req.url + "&page=2"
        }

        process.prevLink = newPrevUrl
        process.nextLink = newNextLink

        res.status(200).send({ status: "OK", data: process })



    } catch (err) {
        res.status(500).send({ status: "ERR", error: err })
    }
}

export const getProductsPid = async (req, res) => {
    try {
        let id = req.params.pid
        res.status(200).send(await pManager.getProductById(id))
    } catch (err) {
        res.status(500).send({ "error": err })
    }
}

export const addProducts = async (req, res) => {
    try {
        if (camposObligatorios.every(e => Object.prototype.hasOwnProperty.call(req.body, e) && req.body[e] !== "" && typeof (req.body.price) === "number" && typeof (req.body.stock) === "number" && typeof (req.body.status) === "boolean")) {
            let session = req.session
            console.log(`esta es la sesion: ${session.usuario} y ${session.rol}`)
            let nuevoProd = req.body
            nuevoProd.owner = session.usuario
            if (session.rol == "admin") {
                nuevoProd.owner = "admin"
            }
            if (!req.body.thumbnails) {
                nuevoProd.thumbnails = []
            }
            const process=await pManager.addProduct(nuevoProd)
            res.status(200).send({status:"OK",data:process,msg:"Articulo Agregado Satisfactoriamente"})
        } else {
            throw new CustomError(errorsDict.PRODUCT_ERROR)
            // res.status(200).send(`Se deben completar todos los campos Y/O con el tipo correcto de datos`)
        }
    } catch (err) {
        const statusCode = err.code || 501
        res.status(statusCode).send({ status: "error", payload: { msg: err.message } })
    }
}

export const updateProducts = async (req, res) => {
    try {
        let session = req.session
        let id = req.params.pid
        let update = req.body
        let product = await pManager.getProductById(id)
        if (session.rol == "admin" || session.usuario == product.owner) {
            res.status(200).send(await pManager.updateProduct(id, update))
        }
        else {
            res.status(200).send("No tiene permisos para modificar este producto")
        }
    } catch (e) {
        res.status(500).send({ "error": err })
    }
}

export const deleteProducts = async (req, res) => {
    try {
        let session = req.session
        let id = req.params.pid
        let product = await pManager.getProductById(id)
        if (session.rol == "admin" || session.usuario == product.owner) {
            if(product.owner!="admin"){
                console.log("Entre al mail de botrrar producto")
                console.log(product.owner)
                let mailResult=await sendEmailProductDelete(product.owner,product)
            }
            res.status(200).send(await pManager.deleteProduct(id))
        }else {
            res.status(200).send("No tiene permisos para eliminar este producto")
        }
    } catch (err) {
        res.status(500).send({ "error": err })
    }
}
import mongoose from "mongoose"
import cartModel from "../../models/cart.model.js"
import productModel from "../../models/product.model.js"
import ticketModel from "../../models/ticket.model.js"
import productManager from "./productManagerDB.js"


class CartManager {
    constructor() {
        this.cStatus = 1
    }

    createCart = async () => {
        const nCart = await cartModel.collection.insertOne({})
        return nCart
    }
    listCartProducts = async (id) => {
        try {
            const arreglo = await cartModel.findById(id).populate({ path: "products.pid", model: productModel }).lean()
            if (arreglo === null) {
                return "El ID del carrito que busca no existe"
            } else {
                return arreglo
            }
        } catch (e) {

            console.log("Update Product error de formato de codigo")
            console.log(e.message)
            return "Formato de codigo erroneo"
        }
    }
    addCartProduct = async (cid, pid) => {
        // try {
        const arreglo = await cartModel.findById(cid)

        if (arreglo === null) {
            return "El ID del carrito que busca no existe"
        } else {

            const existe = await cartModel.find({ "_id": cid, "products.pid": new mongoose.Types.ObjectId(pid) })


            if (existe == "") {

                await cartModel.updateOne(
                    { "_id": new mongoose.Types.ObjectId(cid) },
                    { $push: { products: { pid: new mongoose.Types.ObjectId(pid), quantity: 1 } } }
                )

            } else {

                const found = existe[0].products.findIndex(e => JSON.stringify(e.pid) == JSON.stringify(pid))


                let cantidad = existe[0].products[found].quantity

                cantidad++

                await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid), "products.pid": new mongoose.Types.ObjectId(pid) }, { $set: { "products.$.quantity": cantidad } })
            }
            return "Producto Agregado Correctamente"
        }
        // } catch (e) {
        //     console.log("Update Product error de formato de codigo")
        //     return "Formato de codigo erroneo"
        // }
    }
    deleteCartProduct = async (cid, pid) => {
        try {
            let fil = { $pull: { "products": { pid: new mongoose.Types.ObjectId(pid) } } }
            const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil)

            if (arreglo.matchedCount == 0) {
                return "El ID del carrito no existe"
            } else if (arreglo.modifiedCount == 0) {
                return "El id del Producto indicado no esta en este carrito"
            } else {
                return "Producto eliminado exitosamente"
            }

        } catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
    }

    addListProductCart = async (cid, prodArray) => {
        try {

            let result = prodArray.products.map((e) => e.pid)

            let test = await productModel.find({ "_id": { $in: result } })
            if (result.length != test.length) {
                return "Uno o mas Productos que intenta agregar no son validos"
            } else {

                let fil = { $push: { products: prodArray.products } }
                const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil)
                return arreglo
            }
        } catch (e) {
            console.log("Update Product error de formato de codigo!!")
            return "Formato de codigo erroneo"
        }
    }
    addQuantProdCart = async (cid, pid, quant) => {
        try {

            let fil = { $set: { "products.$[elem].quantity": quant } }
            const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil, { arrayFilters: [{ "elem.pid": pid }] })

            return arreglo
        }
        catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
    }

    emptyCart = async (cid) => {
        try {
            let fil = { $unset: { products: "" } }
            const arreglo = await cartModel.updateOne({ "_id": new mongoose.Types.ObjectId(cid) }, fil)
            return arreglo
        } catch (e) {
            console.log("Update Product error de formato de codigo")
            return "Formato de codigo erroneo"
        }
    }

    listPurchase = async (cid) => {
        try {
            const arreglo = await cartModel.findById(cid).populate({ path: "products.pid", model: productModel }).lean()

            const test = async (cid2) => {
                let format = []
                let tot = 0
                let comment = false
                cid2.products.map((e) => {
                    let stock = e.pid.stock - e.quantity
                    if (stock < 0) {
                        comment = true
                    } else {
                        comment = false
                    }
                    let item = {
                        title: e.pid.title,
                        totalPrice: e.pid.price * e.quantity,
                        quant: e.quantity,
                        unitPrice: e.pid.price,
                        available: comment,
                        pid: e.pid._id
                    }
                    format.push(item)
                    if (!comment) {
                        tot = tot + (e.pid.price * e.quantity)
                    }
                })
                format = {
                    total: tot,
                    prod: [...format]
                }
                return format
            }
            let result = await test(arreglo)

            return result

        } catch (e) {
            return `Formato de codigo erroneo ${e}`
        }
    }

    purchaseOrder = async (cid, userName) => {
        try {
            let result = new CartManager()
            let test = await result.listPurchase(cid)
            let code = CartManager.#randomcode()
            let date = new Date()
            date = date.toLocaleString()
            let eraseArray = []
            let preserveArray = []
            test.prod.map(e => {
                if (e.available) {
                    preserveArray.push(e)
                } else {
                    eraseArray.push(e)
                }
            })

            let ticket = {
                code: code,
                purchase_datetime: date,
                amount: test.total,
                purchaser: userName
            }

            let process = await ticketModel.create(ticket)
            process = await ticketModel.findById(process._id).lean()
            process = {
                orden: process,
                itemError: preserveArray,
                itemClean: eraseArray
            }

            return process

        } catch (e) {
            console.log(e)
        }
    }
    static #randomcode = () => {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        let result = '';
        for (var i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    cleanCart = async (array) => {



        const findItem = async (id) => {
            let item = await productModel.findById(new mongoose.Types.ObjectId(id))
            return item.stock
        }
        const updateStock = async (id, update) => {
            let updateProduct = await productModel.updateOne({ "_id": new mongoose.Types.ObjectId(id) }, update)
            return updateProduct
        }
        const modStock = async (array) => {
            for (let i = 0; i < array.length; i++) {

                let test2 = await findItem(array[i].pid)
                let newStock = {
                    stock: test2 - array[i].quant
                }
                let updateProd = await updateStock(array[i].pid, newStock)

            }

        }
        let result = await modStock(array)
    
            console.log(`Limpiando el Carrito:   ${result}`)
        return result

    }
}



export default CartManager
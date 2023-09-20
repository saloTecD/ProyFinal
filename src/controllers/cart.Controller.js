import cartManager from "../services/dao/cartManagerDB.js"
import productManager from "../services/dao/productManagerDB.js"
import config from "../utils/config.js"

const baseLink=config.RAILWAY_LINK
const cManager = new cartManager()
const pManager = new productManager()

export const createCart=async(req,res)=>{
    res.status(200).send(await cManager.createCart())
}

export const getCartPid=async(req,res)=>{
    let id = req.params.cid
    res.status(200).send(await cManager.listCartProducts(id))
}

export const addProductToCart=async(req,res)=>{
    let session=req.session
    let cid = req.session.pCart
    let pid = req.params.pid
    let product=await pManager.getProductById(pid)
    if (product === "Not Found") {
        res.status(200).send("El producto que quieres agregar no existe")
    }else if(session.usuario==product.owner){
        res.status(200).send({data:"No puedes agregar productos propios"})
    } 
    else {
        const process=await cManager.addCartProduct(cid, pid)
        res.status(200).send({status:"OK",data:process})
    }
}

export const deleteProductToCart=async(req,res)=>{
    let cid = req.session.pCart
    let pid = req.params.pid
    const process = await cManager.deleteCartProduct(cid, pid)
    res.status(200).send({ status: "OK", data: process })
}

export const addListProductToCart=async(req,res)=>{
    let cid = req.params.cid
    let prodArray = req.body
    const process = await cManager.addListProductCart(cid, prodArray)
    res.status(200).send({ status: "OK", data: process })
}

export const addCantProdCart=async(req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let quant = req.body.quantity
    const process = await cManager.addQuantProdCart(cid, pid, quant)
    res.status(200).send({ status: "OK", data: process })
}

export const emptyCart=async(req,res)=>{
    let cid = req.params.cid
    const process = await cManager.emptyCart(cid)
    res.status(200).send({ status: "OK", data: process })
}

export const purchaseOrder=async(req,res)=>{
     let cid=req.session.pCart
     let logo = req.session.usuario
     let rol = req.session.rol
     const process=await cManager.purchaseOrder(cid,logo)
     let order=process.orden
     let items=process.itemError
     let deleteItems=process.itemClean
     const cleanCart=await cManager.cleanCart(deleteItems)
     const emptyCart=await cManager.emptyCart(cid)
     res.render("purchaseOrder",{order:order,items:items, logo:logo,rol:rol,baseLink:baseLink})
 }
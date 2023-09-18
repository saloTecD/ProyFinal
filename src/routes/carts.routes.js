import { Router } from "express";
import { createCart, getCartPid, addProductToCart, deleteProductToCart, addListProductToCart, addCantProdCart, emptyCart,purchaseOrder } from "../controllers/cart.Controller.js"
import {valid,adminRol,userRol} from "../auth/rolValidator.js"

const router = Router()

// router.post("/carts", createCart)//el carro se crea al momento del registro
router.get("/carts/:cid",valid, getCartPid)
router.post("/carts/:cid/products/:pid",userRol, addProductToCart)
router.delete("/carts/:cid/products/:pid", userRol,deleteProductToCart)
router.put("/carts/:cid", addListProductToCart)
router.put("/carts/:cid/products/:pid", addCantProdCart)
router.delete("/carts/:cid",userRol, emptyCart)
router.post("/carts/:cid/purchase",purchaseOrder)


export default router
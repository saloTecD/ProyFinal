import { Router } from "express";
import { getProducts, getProductsPid, addProducts, updateProducts, deleteProducts } from "../controllers/products.Controller.js"
import {valid,adminRol, adminPremiumRol} from "../auth/rolValidator.js"
const router = Router()

router.get("/products", valid,getProducts)
router.get("/products/:pid",valid, getProductsPid)
router.post("/products", adminPremiumRol,addProducts)
router.put("/products/:pid", adminPremiumRol,updateProducts)
router.delete("/products/:pid", adminPremiumRol,deleteProducts)



export default router
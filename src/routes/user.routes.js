import { Router } from "express";
import {updateDocuments, updateRol,getUsers,deleteExpireUsers} from "../controllers/user.Controller.js"
import {valid,adminRol, adminPremiumRol} from "../auth/rolValidator.js"
import { uploaderDocuments } from "../utils/multer.js";
const router=Router()

router.put("/users/premium/:uid",valid,updateRol)
router.post("/users/:uid/documents",valid,uploaderDocuments.fields([
    {name:"id",maxCount:1},
    {name:"domicilio",maxCount:1},
    {name:"cuenta",maxCount:1}
]),updateDocuments)
router.get("/users",valid,getUsers)
router.delete("/users",deleteExpireUsers)
export default router
import { Router } from "express";
import {generateMockProducts} from "../controllers/mock.controller.js"

const mockRoutes=()=>{
    const router=Router()

    router.get("/mockingproducts",generateMockProducts)

    return router
}

export default mockRoutes
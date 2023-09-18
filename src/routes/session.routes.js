import { Router } from "express";
import passport from "../auth/passport.config.js"
import identity from "../auth/userID.js";
import {githubController,githubcbController,currentController} from "../controllers/sessions.controller.js"
const sessionRoutes=(store)=>{
    const router=Router()

    router.get("/github",passport.authenticate("github", { scope: ["user:email"] }),async (req, res) => {
        
    })
    router.get("/githubcb",passport.authenticate("github", { failureRedirect: "/login" }),identity,async (req, res) => {
        req.session.userValidated = req.sessionStore.userValidated = true
        console.log(`-----------${JSON.stringify(req.session)}`)
        req.session.errorMessage = req.sessionStore.errorMessage = ""
        res.redirect("/")
    })
    router.get("/current",currentController)

    return router
}

export default sessionRoutes
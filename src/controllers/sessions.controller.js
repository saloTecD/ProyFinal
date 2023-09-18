import mongoose from "mongoose";
import userModel from "../models/user.model.js"
import userDTO from "../services/userDTO.js";

export const githubController=async(req,res)=>{}
export const githubcbController=async(req,res)=>{
    req.session.userValidated = req.sessionStore.userValidated = true
        console.log(`-----------${JSON.stringify(req.session)}`)
        req.session.errorMessage = req.sessionStore.errorMessage = ""
        res.redirect("/")
}
export const currentController=async(req,res)=>{
    try {
        
        let session = req.session
        const currentUser = await userModel.findById(new mongoose.Types.ObjectId(session.passport.user))
        let acUser=userDTO(currentUser)
        // currentUser.userPassword = "xx"
        
        res.status(200).send({ status: "OK", data: acUser })
    } catch (e) {
        console.log(e.message)
    }
}
import mongoose from "mongoose";
import userModel from "../models/user.model.js"
const identity = async (req, res, next) => {
   
    if (req.session.passport.user == "64a4386586d270d35fe0ca49") {
        req.session.rol = "admin"
        req.session.usuario="adminCoder@coder.com"
    } else {
        const currentUser = await userModel.findById(new mongoose.Types.ObjectId(req.session.passport.user))
        req.session.rol = currentUser.userRol
        req.session.usuario=currentUser.userEmail
        req.session.pCart=currentUser.userCart
        
    }
   console.log(`Login:${req.session.usuario},${req.session.rol}`)
    next()
}

export default identity
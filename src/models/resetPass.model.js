import mongoose from "mongoose";
mongoose.pluralize(null)
const collection="passLinks"
const schema=new mongoose.Schema({
    userEmail:String,
    userLink:String,
    createdAt:Date
})
const resetPassModel=mongoose.model(collection,schema)

export default resetPassModel
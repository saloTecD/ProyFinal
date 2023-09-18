import mongoose from "mongoose"
mongoose.pluralize(null)
const collection = "users"

const schema=new mongoose.Schema({
    userName:String,
    userLastName:String,
    userPassword:String,
    userEmail:String,
    userDocuments:{type:Array,_id:false},
    userLastConnection:Date,
    userAge:{type:Number,default:0},
    userRol:{type:String,default:"user"},
    userCart:{type:mongoose.Schema.Types.ObjectId,
    ref:"carts"}
})

const userModel=mongoose.model(collection,schema)

export default userModel
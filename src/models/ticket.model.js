import mongoose from "mongoose"
mongoose.pluralize(null)
const collection="tickets"

const schema=new mongoose.Schema({
    code:String,
    purchase_datetime:String,
    amount:Number,
    purchaser:String
})

const ticketModel=mongoose.model(collection,schema)

export default ticketModel
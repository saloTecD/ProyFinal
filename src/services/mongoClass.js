import mongoose from "mongoose";
import config from "../utils/config.js";

class MongoSingleton{

    static #instance
    constructor(){
        mongoose.connect(config.MONGOOSEURL,{useNewUrlParser:true,useUnifiedTopology:true})

    }

    static getInstance(){
        if(!this.#instance){
            this.#instance=new MongoSingleton()
            console.log("Conexion BBDD creada")
        }else{
            console.log("Conexion BBDD recuperada")
        }
        return this.#instance
    }
}

export default MongoSingleton
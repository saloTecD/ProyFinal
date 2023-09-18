import mongoose from "mongoose";
import crypto from 'crypto';
import userModel from "../../models/user.model.js"
import bcrypt from "bcrypt"
import cartManager from "./cartManagerDB.js"
import { deleteExpireUsers } from "../../controllers/user.Controller.js";
const cManager = new cartManager()

class UserManager {
    constructor() {
        this.uStatus = 1
    }

    static #encryptPassword = (pass) => {
        return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
    }
    static #comparePassword = (userInDb, pass) => {
        return bcrypt.compareSync(pass, userInDb.userPassword)
    }
    static #findUser = async (email) => {
        const existUser = await userModel.find({ "userEmail": email }).lean()
        return existUser
    }
    createUser = async (nuevoUser) => {
        try {

            let userExist = await UserManager.#findUser(nuevoUser.userEmail)
            if (userExist == "") {
                let newCart = await cManager.createCart()
                nuevoUser.userPassword = UserManager.#encryptPassword(nuevoUser.userPassword)
                nuevoUser.userRol = "user"
                nuevoUser.userCart = new mongoose.Types.ObjectId(newCart.insertedId)
                const nUser = await userModel.create(nuevoUser)
                return nUser
            }
            else {
                return false
            }
        } catch (e) {
            console.log(e.message)
        }
    }
    validateUser = async (userEmail, userPassword) => {
        try {
            let validated = await userModel.findOne({ userEmail: userEmail })
            if (validated === null) {
                return "Usuario no existe"
            } else if (!UserManager.#comparePassword(validated, userPassword)) {
                return "Clave invalida"
            } else {
                return validated
            }

        } catch (e) {
            console.log(e.msg)
        }
    }
    updateUserPass = async (userEmail, userPassword) => {
        let user = await userModel.findOne({ userEmail: userEmail })
        if (UserManager.#comparePassword(user, userPassword)) {
            return "No se puede usar la misma contraseña"
        } else {
            userPassword = UserManager.#encryptPassword(userPassword)
            let updateUser = await userModel.updateOne({ "userEmail": userEmail }, { userPassword: userPassword })
            // console.log(`Resultado del update de la contraseña: ${}`)
            return "Contraseña actualizada"
        }
    }
    updateUserRol = async (userEmail, rol) => {
        let validDocuments = await userModel.findOne({ userEmail: userEmail })
        let id = validDocuments.userDocuments.some(e => e.name === "id")
        let domicilio = validDocuments.userDocuments.some(e => e.name === "domicilio")
        let cuenta = validDocuments.userDocuments.some(e => e.name === "cuenta")
        if (rol === "premium") {
            if (id && domicilio && cuenta) {
                let updateRol = await userModel.updateOne({ "userEmail": userEmail }, { userRol: rol })
                return (updateRol)
            }else{
                return("No se ha subido la documentacion requerida para ejecutar esta operacion")
            }
        }else{
            let updateRol = await userModel.updateOne({ "userEmail": userEmail }, { userRol: rol })
            return (updateRol)
        }


    }
    updateLastConnection = async (userEmail) => {
        let updateConnection = await userModel.updateOne({ "userEmail": userEmail }, { userLastConnection: new Date() })
        return (updateConnection)
    }
    updateDocuments = async (userEmail, files) => {
        let array = []
        if (!files.domicilio || !files.cuenta || !files.id) {
            return ("Documentacion incompleta")
        }

        for (const property in files) {
            let obj = {}
            obj.name = files[property][0].fieldname
            obj.reference = files[property][0].path
            array.push(obj)
        }

        let updateDocs = await userModel.updateOne({ "userEmail": userEmail }, { userDocuments: array })
        return (updateDocs)
    }
    getUsersList=async()=>{
        let userList=await userModel.find().lean()
        return userList
    }
    deleteExpireUsers=async()=>{
        let currentDate=new Date().getTime()
        let result=currentDate-172800000
        //prueba  dos minutos de expiracion
        // let result=currentDate-120000
        //fin prueba dos minutos de expiracion
        let findDate=new Date(result)
        console.log(findDate)
        let usersToDelete=await userModel.deleteMany({userLastConnection:{$lt:findDate}, "_id": {$ne:"64a4386586d270d35fe0ca49"}})
        console.log(`Resultado: ${usersToDelete}`)
    }
}

export default UserManager
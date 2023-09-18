import { } from "dotenv/config"
import passport from "passport"
import mongoose from "mongoose"
import local from "passport-local"
import bcrypt from "bcrypt"
import GithubStrategy from "passport-github2"
import userModel from "../models/user.model.js"
import cartManager from "../services/dao/cartManagerDB.js"

const cManager = new cartManager()
const gitID = process.env.CLIENT_ID
const gitSecret = process.env.CLIENT_SECRET
const gitCallBack = process.env.CALLBACK_URL
const adminUser=process.env.ADMIN_USER
const adminPass=process.env.ADMIN_PASS
const LocalStrategy = local.Strategy

const comparePass = (userInDb, pass) => {
    return bcrypt.compareSync(pass, userInDb.userPassword)
}

const encryptPassword = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
}
const randomPass = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let result = '';
    for (var i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


const githubData = {
    clientID: gitID,
    clientSecret: gitSecret,
    callbackUrl: gitCallBack
}

const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
    try {
        
        console.log("entre aqui")
        const user = await userModel.findOne({ userEmail: profile._json.email })

        if (!user) {
            let newCart = await cManager.createCart()
            let newUser = {
                userName: profile._json.login,
                userLastName: "",
                userPassword: encryptPassword(randomPass()),
                userEmail: profile._json.email,
                userRol: "gitUser",
                userCart: new mongoose.Types.ObjectId(newCart.insertedId)
            }
            let result = await userModel.create(newUser)
            done(null, result, { msg: user })
        } else {

            done(null, user)
        }

    } catch (e) {
        return done(e.message)
    }
}

const verifyUserRegistration = async (username, password, done) => {
    try {

        const user = await userModel.findOne({ userEmail: username })
        if (user === null) {
            return done(null, { id: new mongoose.Types.ObjectId(0) })
        } else {
            return done(null, false, { msg: "Email ya se encuentra registrado" })
        }


    } catch (e) {
        return done(e.message)
    }
}

const verifiUserLogin = async (username, password, done) => {
    try {
        
        if (username === adminUser && password === adminPass) {
            const user={
                id:new mongoose.Types.ObjectId("64a4386586d270d35fe0ca49"),
                userName:"adminCoder",
                userRol:"admin"
            }
            return done(null, user)
        } else {
            const user = await userModel.findOne({ userEmail: username })
            if (user === null) {
                return done(null, false, { msg: "Usuario Invalido" })
            } else if (!comparePass(user, password)) {
                return done(null, false, { msg: "Clave Invalida" })
            } else {
                console.log(user)
                return done(null, user)
            }
        }
    } catch (e) {
        return done(e.message)
    }
}

passport.use("register", new LocalStrategy({ usernameField: "userEmail", passwordField: "userPassword" }, verifyUserRegistration))
passport.use("login", new LocalStrategy({ usernameField: "userEmail", passwordField: "userPassword" }, verifiUserLogin))
passport.use("github", new GithubStrategy(githubData, verifyAuthGithub))


passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err.message);
    }
});



export default passport
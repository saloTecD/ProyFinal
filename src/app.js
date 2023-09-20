import { } from "dotenv/config"
import config from "./utils/config.js";
import cors from "cors"
import express from "express";
import { __dirname } from "./utils.js"
import { engine } from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import passport from "./auth/passport.config.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"

import { addLogger } from "./services/logger.service.js";
import CustomError from "./services/customError.js";
import errorsDict from "./utils/errorDictionary.js";
import MongoSingleton from "./services/mongoClass.js";
import chatManager from "./services/dao/chatManager.js"
import router from "./routes/products.routes.js"
import routerCart from "./routes/carts.routes.js"
import routerUser from "./routes/user.routes.js"
import viewRoutes from "./routes/views.routes.js"
import mockRoutes from "./routes/mock.routes.js"
import sessionRoutes from "./routes/session.routes.js"

const cManager = new chatManager()
const PORT = parseInt(config.PORT)
const server = express()
const MONGOOSEURL = config.MONGOOSEURL
const SESSION_SECRET = config.SESSION_SECRET

const swaggerOptions={
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentacion Ecommerce",
            description:"Esta documentacion cubre los modulos de productos y carrito"
        }
    },
    apis:["./src/docs/**/*.yaml"]
}
const specs=swaggerJSDoc(swaggerOptions)

try {

    MongoSingleton.getInstance()
    const httpServer = server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
    const io = new Server(httpServer)
    // Integracion Chat----------------------------------------------------------------------------------
    let messages = []
    io.on('connection', socket => {
        console.log("Nuevo Cliente Conectado")
        socket.on('message', data => {
            messages.push(data)
            cManager.addMessages(data)
            io.emit('messageLogs', messages)
        })
    })
} catch (e) {
    console.log("No se ha podido establecer la conexion con el puerto")
}
// Fin integracion Chat------------------------------------------------------------------------------

server.use(express.json())
server.use(addLogger)
server.use(cors({
    origin: config.ALLOWED_ORIGINS,
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}))
server.use(express.urlencoded({ extended: true }))
const store = MongoStore.create({ mongoUrl: MONGOOSEURL, mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 3600 })
server.use(session({
    store: store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
server.use(passport.initialize())
server.use(passport.session())
server.use("/api", router)
server.use("/api", routerCart)
server.use("/api",routerUser)
server.use("/", viewRoutes(store))
server.use("/",mockRoutes())
server.use("/api/sessions", sessionRoutes(store))
server.use("/public", express.static(`${__dirname}/public`))
server.use("/apidocs",swaggerUiExpress.serve,swaggerUiExpress.setup(specs))
server.engine("handlebars", engine())
server.set("view engine", "handlebars")
server.set("views", `${__dirname}/views`)
server.all("*",(req,res,next)=>{
    req.logger.warn(`${new Date().toLocaleDateString()}: Se intento acceder a una ruta no valida - ${req.url}`)
    throw new CustomError(errorsDict.ROUTING_ERROR)
})
server.use((err,req,res,next)=>{
    const statusCode=err.code||501
    res.status(statusCode).send({status:"ERR",payload:{msg:err.message}})
})
import config from "../utils/config.js"
import winston from "winston"

const MODE=config.MODE
const devLogger=winston.createLogger({
    transports:[
        new winston.transports.Console({level:"verbose"})
    ]
})
const prodLogger=winston.createLogger({
    transports:[
        new winston.transports.Console({level:"http"}),
        new winston.transports.File({level:"warn",filename:"./src/utils/logs/error.log"})
    ]
})

export const addLogger=(req,res,next)=>{
    
    req.logger=MODE=="DEV"?devLogger:prodLogger
    
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}
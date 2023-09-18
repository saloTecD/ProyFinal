import dotenv from "dotenv"
import {Command} from "commander"

const program=new Command()
program
    .version('2.0.1')
    // .option("-p --port <port>","Execution port",8080)
    .option("-m --mode <mode>","Execution mode(PRODUCTION/DEVELOPMENT)","PRODUCTION")
    .option("-d --debug","Activate / deactivate debug",false)
    .parse(process.argv)
const cl_options=program.opts()

// dotenv.config({path:"./.env"})
let haha
cl_options.mode=="DEV"?haha=1:haha=2
console.log(haha)
dotenv.config({path:cl_options.mode=="DEV"?"./.env.dev":"./.env.prod"})

const cors_origins=process.env.ALLOWED_ORIGINS

const config={
    MODE:process.env.MODE,
    PORT:process.env.PORT,
    MONGOOSEURL:process.env.MONGOOSEURL,
    ALLOWED_ORIGINS:cors_origins.includes(",")?cors_origins.split(",").map(item=>item.trim()):cors_origins,
    SESSION_SECRET:process.env.SESSION_SECRET,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    CALLBACK_URL:process.env.CALLBACK_URL,
    ADMIN_USER:process.env.ADMIN_USER,
    ADMIN_PASS:process.env.ADMIN_PASS,
    GMAIL_PASS:process.env.GMAIL_PASS,
    GMAIL_USER:process.env.GMAIL_USER

}

export default config
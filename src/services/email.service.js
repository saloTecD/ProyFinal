import config from "../utils/config.js"
import nodemailer from "nodemailer"
import randomGenerator from "../utils/random.js"
import resetPassModel from "../models/resetPass.model.js"

const baseLink=config.RAILWAY_LINK
const GMAIL_USER=config.GMAIL_USER
const GMAIL_PASS=config.GMAIL_PASS

const transport=nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:GMAIL_USER,
        pass:GMAIL_PASS
    }
})

export const sendMail=async (userEmail,userLink)=>{
    const result=await transport.sendMail({
        from:"Tienda En Linea <salo.tec.d@gmail.com>",
        to:userEmail,
        subject:"Restablecer contraseña",
        html:`
            <h1>Restablece tu contraseña</h1>
            <p>Se ha generado un peticion para reestablecer la contraseña de tu cuenta</p>
            <p>si no has sido tu, por favor omite este mensaje</p>
            <a href=${userLink}><button style="color:blue">Reset Password</button></a>
        `,
        attachments:[]
    })

    return result
}
export const generateRandomLink=async(userEmail)=>{
    let randomLink=randomGenerator()
    let link=`${baseLink}/restablecercontrasena/${randomLink}`
    let tempLink={
        userEmail:userEmail,
        userLink:randomLink,
        createdAt:new Date()
    }
    let newLink=await resetPassModel.create(tempLink)
    await sendMail(userEmail,link)
    return newLink

}

export const validateLink=async(link)=>{
    let validLink=await resetPassModel.findOne({userLink:link})
    return(validLink)
}
export const sendEmailAdminDelete=async(userEmail)=>{
    const result=await transport.sendMail({
        from:"Tienda En Linea <salo.tec.d@gmail.com>",
        to:userEmail,
        subject:"Cuenta eliminada",
        html:`
            <h1>Cuenta Eliminada</h1>
            <p>Se ha generado un peticion para eliminar esta cuenta por el administrador del sitio</p>
            <p>si crees que es un error, por favor contacta con nuestro servicio tenico</p>
            
        `,
        attachments:[]
    })

    return result
}
export const sendEmailExpireDelete=async(userEmail)=>{
    const result=await transport.sendMail({
        from:"Tienda En Linea <salo.tec.d@gmail.com>",
        bcc:userEmail,
        subject:"Cuenta eliminada",
        html:`
            <h1>Cuenta Eliminada</h1>
            <p>Esta cuenta ha sido eliminada automaticamente por inactividad</p>
            <p>si crees que es un error, por favor contacta con nuestro servicio tenico</p>
            
        `,
        attachments:[]
    })

    return result
}
export const sendEmailProductDelete=async(userEmail,prod)=>{
    const result=await transport.sendMail({
        from:"Tienda En Linea <salo.tec.d@gmail.com>",
        to:userEmail,
        subject:"Producto eliminado",
        html:`
            <h1>Producto Eliminado</h1>
            <p>Se ha eliminado el siguiente producto de tu comercio</p>
            <p>${prod}</p>
            <p>si crees que es un error, por favor contacta con nuestro servicio tenico</p>
            
        `,
        attachments:[]
    })

    return result
}
import userManager from "../services/dao/userManager.js"
import userDTO from "../services/userDTO.js"
import { sendEmailAdminDelete,sendEmailExpireDelete } from "../services/email.service.js"
const uManager=new userManager()

export const updateRol=async(req,res)=>{
    // let uid=req.session.usuario
    let uid=req.params.uid
    let rol=req.body.rol
    let result=await uManager.updateUserRol(uid,rol)
    res.status(200).send({status:"OK",data:result})
}
export const updateDocuments=async(req,res)=>{
    let files=req.files
    let userEmail=req.session.usuario
    let result=await uManager.updateDocuments(userEmail,files)
    
    
    res.status(200).send({status:"OK",data:result})
}
export const getUsers=async(req,res)=>{
    let result=await uManager.getUsersList()
    let newResult=[]
    for (const elem of result){
        if(elem._id!="64a4386586d270d35fe0ca49"){
        newResult.push(userDTO(elem))}
    }
    console.log(newResult)
    res.status(200).send({status:"OK",data:newResult})
}
export const deleteExpireUsers=async(req,res)=>{
    let recipients=[]
    let result=await uManager.deleteExpireUsers()
    for(const elem of result){
        recipients.push(elem.userEmail)
    }
    sendEmailExpireDelete(recipients)
    console.log(recipients)
    res.status(200).send({status:"OK",data:result})
}
export const deleteUser=async(req,res)=>{
    let uid=req.params.uid
    let emailSendResult=sendEmailAdminDelete(uid)
    let result=await uManager.deleteUser(uid)
    res.status(200).send({status:"OK",data:result})
}
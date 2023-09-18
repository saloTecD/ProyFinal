import userManager from "../services/dao/userManager.js"
import userDTO from "../services/userDTO.js"
const uManager=new userManager()

export const updateRol=async(req,res)=>{
    let uid=req.session.usuario
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
        newResult.push(userDTO(elem))
    }
    console.log(newResult)
    res.status(200).send({status:"OK",data:newResult})
}
export const deleteExpireUsers=async(req,res)=>{
    let result=await uManager.deleteExpireUsers()
    res.status(200).send({status:"OK",data:result})
}
export const adminRol = (req, res, next) => {
    console.log(`validador: ${req.session.rol}`)
    if (req.session.rol != "admin") {
        res.status(300).send({ status: "OK", error: "Este usuario no tiene acceso al recurso solicitado, contacte al administrador" })
        

    } else {
        
        next()
    }
}

export const userRol=(req,res,next)=>{
    console.log(`en el validador${req.session.rol}`)
    if(req.session.rol =="user"||req.session.rol=="gitUser"||req.session.rol=="premium"){
        next()
    }
   
    else{
        res.status(300).send({ status: "OK", error: "El administrador no tiene acceso a este recurso"})
        
    }
}
export const valid=(req,res,next)=>{
    if(!req.session.rol){
        res.status(300).send({ status: "OK", error: "Usuario no validado, por favor ingrese a http://localhost:8080"})
    }else{
        next()
    }
}
export const adminPremiumRol = (req, res, next) => {
    console.log(`validadores: ${req.session.rol}`)
    if (req.session.rol == "admin"||req.session.rol=="premium") {
        next()

    } else {
        res.status(300).send({ status: "OK", error: "Este usuario no tiene acceso al recurso solicitado, contacte al administrador" })
        
    }
}
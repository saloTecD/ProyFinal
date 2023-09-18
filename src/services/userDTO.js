const userDTO=(data)=>{
    
    let user={
        userName:data.userName,
        userEmail:data.userEmail,
        userRol:data.userRol
    }
    return user
}

export default userDTO
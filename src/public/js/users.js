const btns=document.querySelectorAll(".urol")
btns.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`http://localhost:8080/api/users/premium/${event.target.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({"rol":"user"})
        })
        .then(response=>response.json())
        .then(response=>{
            alert(response.data)
            location.reload()
        })
    })
})

const btnsPremium=document.querySelectorAll(".prol")
btnsPremium.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`http://localhost:8080/api/users/premium/${event.target.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({"rol":"premium"})
        })
        .then(response=>response.json())
        .then(response=>{
            alert(response.data)
            location.reload()
           
        })
    })
})
const btnsDelete=document.querySelectorAll(".deleteUser")
btnsDelete.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`http://localhost:8080/api/user/${event.target.id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(response=>response.json())
        .then(response=>{
            alert(response.data)
            location.reload()
           
        })
    })
})
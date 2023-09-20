import baseLink from "./baselink.js"
const link=baseLink()

const cartBtns=document.querySelectorAll(".cbbtt")
cartBtns.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`${link}/api/carts/usercart/products/${event.target.id}`,{
            method:"DELETE",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            }
        })
        .then(response=>response.json())
        .then(response=>{
            location.reload()
        })
    })
})
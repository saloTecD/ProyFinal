import baseLink from "./baselink.js"
const link=baseLink()
console.log(link)
const btns=document.querySelectorAll(".bbtt")
btns.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`${link}/api/carts/usercart/products/${event.target.id}`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            }
        })
        .then(response=>response.json())
        .then(response=>{
            
            Swal.fire({
                
                title:JSON.stringify(response.data)+" en el Carrito"
            })
            console.log(response)
        })
        console.log(event.target.id)
    })
})


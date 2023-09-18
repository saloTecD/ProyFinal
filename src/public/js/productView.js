const btns=document.querySelectorAll(".bbtt")
btns.forEach(btn=>{
    btn.addEventListener("click",event=>{
        fetch(`http://localhost:8080/api/carts/64aff08e4f64690b6ebba41f/products/${event.target.id}`,{
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


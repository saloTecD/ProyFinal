import {Faker,en} from "@faker-js/faker"

const faker=new Faker({locale:[en]})

export const generateMockProducts =async(req,res)=>{
const products=[]
for(let i=0;i<50;i++){
    products.push(generateProducts())
}
return res.status(200).send({status:"OK",data:products})
}

const generateProducts=()=>{


    return{
        title:faker.commerce.productName(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price(),
        thumbnails:[faker.image.urlLoremFlickr()],
        code:faker.string.alphanumeric(6),
        stock:faker.number.int(100),
        status:faker.datatype.boolean(0.5),
        category:faker.commerce.department(),
        owner:faker.helpers.arrayElement(["admin","slopez@gmail.com","salo.tec.d@gmail.com","test@gmail.com"])
    }
}
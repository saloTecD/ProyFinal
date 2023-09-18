import multer from "multer";
import {__dirname} from "../utils.js"
import path from "path";
// export const storageProfile=multer.diskStorage({
//     destination:function(req,file,cb)
// })

// export const storageProducts=multer.diskStorage({
//     destination:function(req,file,cb)
// })

const storageDocuments=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,`${__dirname}/uploads/documents`)
    },
    filename:(req,file,cb)=>{
        cb(null,req.session.usuario+"_"+file.fieldname+path.extname(file.originalname))
    }
})

export const uploaderDocuments=multer({storage:storageDocuments})
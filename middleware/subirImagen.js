import multer from 'multer' // permite almacena archivo
import path from 'path' // Retona la ubicación de un archivo
import  { generarId } from '../helpers/token.js'

const storage = multer.diskStorage({

    destination: function(req, file, cb){
        cb(null,'./public/uploads/')
    },
    filename: function(req, file, cb){
        cb(null, generarId() +  path.extname(file.originalname))
    }
})

const upload = multer({ storage })

export default upload
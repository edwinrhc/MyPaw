import express from "express";
import { body } from "express-validator";
import {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarServicio,
    enviarMensaje,
    verMensajes
} from "../controllers/serviciosController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

router.get("/mis-servicios", protegerRuta, admin);
router.get("/servicios/crear", protegerRuta, crear);
router.post(
    "/servicios/crear",
    protegerRuta,
    body("titulo")
        .notEmpty()
        .withMessage("El titulo del Servicio es obligatorio"),
    body("descripcion")
        .notEmpty()
        .withMessage("La descripción no puede ir vacía")
        .isLength({ max: 500 })
        .withMessage("La Descripcion es muy larga"),
    body("categoria").isNumeric().withMessage("Selecione una categoria"),
    body("precio").isNumeric().withMessage("Seleccione un rango de precio"),
    body("lat")
        .notEmpty()
        .withMessage("Ubica la propiedad donde darás el servicio"),
    guardar
);

router.get("/servicios/agregar-imagen/:id", protegerRuta, agregarImagen);

router.post(
    "/servicios/agregar-imagen/:id",
    protegerRuta,
    upload.single("imagen"),
    almacenarImagen
);

router.get("/servicios/editar/:id", protegerRuta, editar);


router.post(
    "/servicios/editar/:id",
    protegerRuta,
    body("titulo")
        .notEmpty()
        .withMessage("El titulo del Servicio es obligatorio"),
    body("descripcion")
        .notEmpty()
        .withMessage("La descripción no puede ir vacía")
        .isLength({ max: 200 })
        .withMessage("La Descripcion es muy larga"),
    body("categoria").isNumeric().withMessage("Selecione una categoria"),
    body("precio").isNumeric().withMessage("Seleccione un rango de precio  "),
    body("lat")
        .notEmpty()
        .withMessage("Ubica la propiedad donde darás el servicio"),
    guardarCambios
);

// Eliminar
router.post('/servicio/eliminar/:id',
    protegerRuta,
    eliminar
)
//Modificar estado
router.put('/servicio/:id',
    protegerRuta,
    cambiarEstado

)


// Area Pública
router.get('/servicio/:id', 
identificarUsuario,
mostrarServicio)


// Almacenar los mensajes
router.post('/servicio/:id', 
identificarUsuario,
body('mensaje').isLength({min:10}).withMessage('El mensaje no puede ir vacío o es muy corto'),
enviarMensaje

)

router.get('/mensajes/:id', 
    protegerRuta,
    verMensajes
)



export default router;

import express from "express";
import { body } from "express-validator";
import { formularioMascotas,guardar,admin,eliminar,editar,guardarCambios } from "../controllers/mascotasController.js";
import protegerRuta from "../middleware/protegerRuta.js";
const router = express.Router();

//Routing
// Mis Mascotas
router.get("/mis-mascotas", protegerRuta, admin);


//Registro
router.get("/mascotas/crear", protegerRuta,formularioMascotas);
router.post(
    "/mascotas/crear",
    protegerRuta,
    body("nombre")
        .notEmpty()
        .withMessage("Es obligatorio"),
    body("tipo_mascota")
        .notEmpty()
        .withMessage("Es obligatorio"),
    body("raza") .notEmpty().withMessage("Escriba una raaza"),
    body("edad") .notEmpty().withMessage("Escriba la edad"),
    body("descripcion")
    .notEmpty()
    .withMessage("La descripción no puede ir vacía")
    .isLength({ max: 500 }),
    guardar
);

//Editar
router.get("/mascotas/editar/:id", protegerRuta, editar);
router.post(
    "/mascotas/editar/:id",
    protegerRuta,
    body("nombre")
        .notEmpty()
        .withMessage("Es obligatorio"),
    body("tipo_mascota")
        .notEmpty()
        .withMessage("Es obligatorio"),
    body("raza").notEmpty().withMessage("Es obligatorio"),
    body("edad").notEmpty().withMessage("Es obligatorio"),
    guardarCambios
);

// Eliminar
router.post('/mascotas/eliminar/:id',
    protegerRuta,
    eliminar
)

export default router;

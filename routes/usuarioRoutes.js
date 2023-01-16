import express from "express";
import { body } from "express-validator";
import { formularioLogin, formularioRegistro, formularioOlvidePassword,registrar,confirmar,
    resetPassword,comprobarToken,nuevoPassword,autenticar,cerrarSesion,editar,guardarCambios } from "../controllers/usuarioController.js";
import protegerRuta from "../middleware/protegerRuta.js";

const router = express.Router();

// Routing
router.get('/login', formularioLogin);
router.post('/login',autenticar);

// Cerrar sesion
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);


// Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);


// Editar Usuario
router.get("/editar/:id",protegerRuta,editar);

router.post(
    "/editar/:id",
    protegerRuta,
    body("nombre")
        .notEmpty()
        .withMessage("El Nombre es requerido")
        .isLength({ max: 20 })
        .withMessage('El nombre debe ser de máximo 20 caracteres'),
    body("apellido_paterno")
        .notEmpty()
        .withMessage("El Apellido Paterno es requerido")
        .isLength({ max: 20 })
        .withMessage('El apellido paterno debe ser de máximo 20 caracteres'),
    body("apellido_materno")
        .notEmpty()
        .withMessage("El Apellido Materno es requerido")
        .isLength({ max: 20 })
        .withMessage('El apellido materno debe ser de máximo 20 caracteres'),
    body("numero_contacto")
        .notEmpty()
        .withMessage("El número es requerido")
        .isLength({ max: 15 })
        .withMessage('El número debe ser de máximo 15 caracteres'),
    guardarCambios
);


export default router;
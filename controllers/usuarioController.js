import { check, validationResult } from "express-validator";
import bcryptjs from 'bcryptjs';

import Usuario from "../models/Usuario.js";
import {generarJWT, generarId } from "../helpers/token.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

// Formulario de Login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken()
  });
};

// Autenticar
const autenticar = async (req, res) => {
    // console.log('auntenticando...');
    await check('email')
    .isEmail()
    .withMessage('El email es Obligatorio')
    .isLength({ max: 100 }).withMessage('El correo debe ser de máximo 20 caracteres')
    .run(req);
    await check('password')
    .isLength({ min: 6 })
    .withMessage('El Password es obligatorio')
    .isLength({ max: 15 }).withMessage('El password debe ser de máximo 15 caracteres')
    .run(req);

    let resultado = validationResult(req)

    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
      //Errores
      return res.render("auth/login", {
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }


    const { email, password }  = req.body

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where : {email }})
    if(!usuario) {
      return res.render('auth/login', {
         pagina: 'Iniciar Sesión',
         csrfToken: req.csrfToken(),
         errores: [
          {msg: 'El usuariono existe'}
         ]
      })
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
       return res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        errores: [{msg: 'Tu Cuenta no ha sido Confirmada'}]
       })
    }
    // Revisar el password
    if(!usuario.verificarPassword(password)){

      return res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        errores: [{msg: 'El password es incorrecto'}]
       })
    }

    // Autenticar al usuario

    const token = generarJWT({
            id : usuario.id,
          nombre: usuario.nombre });

          console.log(token);

          // Almacenar en un cookie
          return res.cookie('_token', token, {
            httpOnly: true,  //Evitar los ataques crossfile
      
    }).redirect('/')
    //
    // .redirect('/mis-servicios')



}

// Cerrar Sesion
const cerrarSesion = (req, res) => {
  
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}

// Formulario  de registro
const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
  });
};

const registrar = async (req, res) => {
  //Validacion
  await check("nombre")
    .notEmpty().withMessage("El nombre es Obligatorio")
    .isLength({ max: 40 }).withMessage('El nombre debe ser de máximo 40 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u).withMessage('No se permite caracteres especiales o números en el nombre')
    .run(req);
  await check("apellido_paterno")
    .notEmpty().withMessage("El apellido paterno es Obligatorio")
    .isLength({ max: 40 }).withMessage('El apellido paterno debe ser de máximo 40 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u).withMessage('No se permite caracteres especiales o números en el apellido paterno')
    .run(req);
  await check("apellido_materno")
    .notEmpty().withMessage("El apellido materno es Obligatorio")
    .isLength({ max: 40 }).withMessage('El apellido materno debe ser de máximo 40 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u).withMessage('No se permite caracteres especiales o números en el apellido materno')
    .run(req);
  await check("numero_contacto")
    .notEmpty().withMessage("El número  es Obligatorio")
    .isLength({ max: 15 }).withMessage('El número debe ser de máximo 15 caracteres')
    .isAlphanumeric().withMessage('No se permite caracteres especiales ni letras en el número')
    .matches(/^(?!(\d)\1{3,}).*$/).withMessage("No se permiten números consecutivos iguales")
    .not().matches(/^0+$/).withMessage('El número de teléfono no puede ser solo ceros')
    .run(req);

  await check("email")
    .isEmail().withMessage("El email es Incorrecto")
    .isLength({ max: 50 }).withMessage('El correo debe ser de máximo 50 caracteres')
    .run(req);
  await check("password")
    .isLength({ min: 6 }).withMessage("El password debe ser de al menos 6 caracteres")
    .isLength({ max: 15 }).withMessage('El password debe ser de máximo 15 caracteres')
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Los Passwords no son iguales")
    .isLength({ min: 6 }).withMessage("El password debe ser de al menos 6 caracteres")
    .isLength({ max: 15 }).withMessage('El password debe ser de máximo 15 caracteres')
    .run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado este vacío
  if (!resultado.isEmpty()) {
    //Errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        numero_contacto: req.body.numero_contacto
       
      }
    });
  }

  // Extraer los datos
  const { nombre, apellido_paterno, apellido_materno,numero_contacto, email, password } = req.body;

  // Verificar que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({ where: { email: email } });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Este correo se encuentra en uso" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        numero_contacto: req.body.numero_contacto
      },
    });
  }

  //Almacenar un usuario
  const usuario = await Usuario.create({
    nombre,
    apellido_paterno,
    apellido_materno,
    numero_contacto,
    email,
    password,
    token: generarId(),
  });

  // Envia email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  // Mostrar mensaje de confirmación
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un Email de confirmación, presiona en el  enlace"
  });
};
// Fin de registro usuario

// Función que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
        pagina: "Error al confirmar tu cuenta",
        mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
        error: true,
        });
    }
    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();
    res.render("auth/confirmar-cuenta", {
        pagina: "Cuenta Confirmada",
        mensaje: "La cuenta se confirmó correctamente",
    });
};
// Olvide password
const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recuperare tu acceso a MyPaw",
    csrfToken: req.csrfToken()
  });
};


//Resetear contraseña
const resetPassword =  async (req, res) => {
        //Validacion
    await check("email")
    .isEmail()
    .withMessage("Eso no parece un email")
    .isLength({ max: 100 }).withMessage('El correo debe ser de máximo 100 caracteres')
    .run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
    //Errores
    return res.render("auth/olvide-password", {
        pagina: "Recuperare tu acceso a MyPaw",
        csrfToken: req.csrfToken(),
        errores: resultado.array()
    });
    }

    // Buscar el usuario

    const { email } = req.body
        //Buscado en la base de datos
    const usuario = await Usuario.findOne({ where: {email}} )

    if(!usuario){
        return res.render("auth/olvide-password", {
            pagina: "Recuperare tu acceso a MyPaw",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a ningín usuario'}]
        });
    }
    //Generar un toke y enviar el email
    usuario.token = generarId(); //generamos un ID único
    await usuario.save();

    //Enviar Email 
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Renderizar un mensaje
    res.render("templates/mensaje", {
        pagina: "Reestablece tu Password",
        mensaje: "Hemos enviado un Email con las instrucciones",
      });

        
}

const comprobarToken  = async (req, res) => {

    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: {token}})

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{

            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true

        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestable Tu password',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword  = async (req, res) => {

    // Validar el password
    await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .isLength({ max: 15 }).withMessage('El password debe ser de máximo 15 caracteres')
    .run(req);
    await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Los Passwords no son iguales")
    .isLength({ max: 15 }).withMessage('El repetir password debe ser de máximo 15 caracteres')
    .run(req);


    let resultado = validationResult(req);

    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
      //Errores
      return res.render("auth/reset-password", {
        pagina: "Restablece tu Password",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }

    const {token } = req.params
    const {password } = req.body;

    // Identificar  quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})
    
    //  Hashear el nuevo password
    const salt = await bcryptjs.genSalt(10)
    usuario.password = await bcryptjs.hash(password, salt);
    usuario.token = null; //El toke ya no va estar disponible

    await usuario.save(); // Guardamos el usuario

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardo correctamente'
    })

    
}


const editar = async (req,res) => {

const {id} = req.params;

const usuario = await Usuario.findByPk(id);
//${servicio.titulo}

res.render("auth/editar", {
  pagina: `Editar Usuario`,
  csrfToken: req.csrfToken(),
  datos: usuario
});



}

const guardarCambios = async (req, res) => {

 // Verificar la validacion
 let resultado = validationResult(req);

  const { id } = req.params;
  // Validar que  exista
  const usuario = await Usuario.findByPk(id);

  // Verificar que el resultado este vacío
  if (!resultado.isEmpty()) {
    //Errores
    return res.render("auth/editar", {
      pagina: "Editar Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      datos: req.body
    });
  }
  


  //Reescribir el objeto y actualizarlo
  try {
    const {
    nombre,
    apellido_paterno,
    apellido_materno,
    numero_contacto
    
    } = req.body;


    usuario.set({
    nombre,
    apellido_paterno,
    apellido_materno,
    numero_contacto
    
    });



    await usuario.save();

    console.log(usuario.save() + " ver");
    res.redirect("/mis-servicios");

  } catch (error) {
    console.log(error);
  }

}

export {
  formularioLogin,
  autenticar,
  cerrarSesion,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  editar,
  guardarCambios
};

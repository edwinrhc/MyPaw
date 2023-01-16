import { check, validationResult} from "express-validator";
import { Mascotas, TipoMascota } from "../models/index.js";


// Mis mascotas
const admin = async(req, res) => {

  // Leer QueryString
  const {pagina: paginaActual} = req.query
  console.log(req.query.paginaActual);

  const expresion = /^[0-9]$/

  if(!expresion.test(paginaActual)){
    return res.redirect('/mis-mascotas?pagina=1')
    }

    try {

        const { id } = req.usuario;
        const { nombre } = req.usuario;
        const { apellido_paterno } = req.usuario;
        const { apellido_materno } = req.usuario;

        //Limite y Offset para el paginador
        const limit=3;
        const offset = ((paginaActual*limit) - limit)


    const [mascotas, total ] = await Promise.all([
        Mascotas.findAll({
         limit: limit,
         offset: offset,
         where: {
           usuarioId: id,
         },
        //  Cruzamos la relaciones
         include: [
          // Se asigno como tipomascotum
           { model: TipoMascota, as: "tipo_mascotum" }
         ],
       }),
       Mascotas.count({
         where: {
           usuarioId: id
         }
       })
     ])

     res.render("mascotas/admin", {
        pagina: "Mis Mascotas",
        usuario: `${nombre.toUpperCase()} ${apellido_paterno.toUpperCase()} ${apellido_materno.toUpperCase()}`,
        usuarioId: `${id}`,
        mascotas: mascotas,
        csrfToken: req.csrfToken(),
        paginas: Math.ceil(total/limit),
        paginaActual: Number(paginaActual),
        total,
        offset,
        limit

     })
        
    } catch (error) {

        console.log(error);
        
    }

}


// Formulario de registro Mascotas
const formularioMascotas  = async (req, res) => {

    // Modelo de precio y categoria
    const [tipo_mascotas] = await Promise.all([
      TipoMascota.findAll()

    ]);

    res.render("mascotas/crear", {
        pagina: "Registro de mascotas",
        csrfToken: req.csrfToken(),
        tipo_mascotas: tipo_mascotas,
        datos: {}
    });

   
};


const guardar  = async(req,res) => {
    // Validamos los registros
    let resultado = validationResult(req);

    const tipo_mascotas = await Promise.all([
      TipoMascota.findAll()
    ]);

    

    if(!resultado.isEmpty()){
        return res.render("mascotas/crear", {
            pagina: "Registro de mascotas",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            tipo_mascotas:tipo_mascotas,
            datos: req.body
        });
    }

    // Creamos el registro
    const {
        nombre,
        raza,
        edad,
        descripcion,
        tipo_mascota: tipomascotaId
    } = req.body;

    const { id: usuarioId} = req.usuario;

    try {
        const mascotaGuardado = await Mascotas.create({
        
            nombre: nombre,
            raza: raza,
            edad: edad,
            descripcion:descripcion,
            tipomascotaId,
            usuarioId

        });

        const { id } = mascotaGuardado;

        // Mostrar mensaje de confirmación
        res.render("templates/mensaje", {
            pagina: "Mascota creada correctamente"
        });

    } catch (error) {
        console.log(error);
      }

};

const editar = async (req, res) => {
    const { id } = req.params;
  
    // Validar que el servicio exista
    const mascota = await Mascotas.findByPk(id);
  
    if (!mascota) {
      return res.redirect("/mis-mascotas");
    }
  
    // Revisar que quien vistar la URL, es quien creo el servicio
    if (mascota.usuarioId.toString() !== req.usuario.id.toString()) {
      return res.redirect("/mis-mascotas");
    }
  

  // Modelo de precio y categoria
  const [tipo_mascotas] = await Promise.all([
    TipoMascota.findAll()
  ]);
  
    res.render("mascotas/editar", {
      pagina: `Editar Mascota: ${mascota.nombre}`,
      csrfToken: req.csrfToken(),
      tipo_mascotas:tipo_mascotas,
      datos: mascota
  
    });
  };

const guardarCambios = async (req, res) => {
    // Verificar la validacion
    let resultado = validationResult(req);

    const [tipo_mascotas] = await Promise.all([
      TipoMascota.findAll()
    ]);
  
  
    if (!resultado.isEmpty()) {
      return res.render("mascotas/editar", {
        pagina: "Actualiza los datos de la mascota",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
        tipo_mascotas:tipo_mascotas,
        datos: req.body
      });
    }
  
    const { id } = req.params;
  
    // Validar que el servicio exista
    const mascota = await Mascotas.findByPk(id);
  
    if (!mascota) {
      return res.redirect("/mis-mascotas");
    }
  
    // Revisar que quien vistar la URL, es quien creo el servicio
    if (mascota.usuarioId.toString() !== req.usuario.id.toString()) {
      return res.redirect("/mis-mascotas");
    }
  
    // Reescribir el objeto y actualizar
  
    try {
      // Reescribir un registro
      const {
        nombre,
        raza,
        edad,
        descripcion,
        tipo_mascota: tipomascotaId
      } = req.body;
  
      mascota.set({
        nombre,
        raza,
        edad,
        descripcion,
        tipomascotaId
      });
  
      await mascota.save();

      console.log(tipomascotaId + " animakl******************");
  
      res.redirect("/mis-mascotas");
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async(req, res) => {

    const { id } = req.params;
  
    // Validar que el servicio exista
    const mascota = await Mascotas.findByPk(id);
  
    if (!mascota) {
      return res.redirect("/mis-mascotas");
    }
  
    // Revisar que quien vistar la URL, es quien creo el servicio
    if (mascota.usuarioId.toString() !== req.usuario.id.toString()) {
      return res.redirect("/mis-mascotas");
    }
  
  
    // Eliminar el servicio
    await mascota.destroy()
  
    res.redirect('/mis-mascotas')
  
  }


export {

    admin,
    formularioMascotas,
    guardar,
    editar,
    guardarCambios,
    eliminar
}
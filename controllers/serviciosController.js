import {unlink} from 'node:fs/promises'
import { validationResult } from "express-validator";
import { Precio, Categoria, Servicios, Mensaje, Usuario } from "../models/index.js";
import {esServidor, formatearFecha} from '../helpers/index.js';

const admin = async (req, res) => {

  // Leer QueryString
  const {pagina: paginaActual} = req.query
  console.log(req.query.paginaActual);

  const expresion = /^[0-9]$/
  
  if(!expresion.test(paginaActual)){
      return res.redirect('/mis-servicios?pagina=1')
  }

  try {

    const { id } = req.usuario;
    const { nombre } = req.usuario;
    const { apellido_paterno } = req.usuario;
    const { apellido_materno } = req.usuario;

    // console.log(id);

    //Limite y Offset para el paginador
    const limit=5;
    const offset = ((paginaActual*limit) - limit)


    const [servicios, total ] = await Promise.all([
       Servicios.findAll({
        limit: limit,
        offset: offset,
        where: {
          usuarioId: id,
        },
        //Cruzamos la relaciones
        include: [
          { model: Categoria, as: "categoria" },
          { model: Precio, as: "precio" },
          { model: Mensaje, as: "mensajes"}
        ]
      
      }),
      Servicios.count({
        where: {
          usuarioId: id
        }
      })
    ])


    res.render("servicios/admin", {
      pagina: "Mis Servicios",
      usuario: `${nombre.toUpperCase()} ${apellido_paterno.toUpperCase()} ${apellido_materno.toUpperCase()}`,
      usuarioId: `${id}`,
      servicios: servicios,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total/limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit
    });
    
  } catch (error) {

    console.log(error);
  }


};

// Formulario para crear una nuevo servicio
const crear = async (req, res) => {
    // Modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    res.render("servicios/crear", {
      pagina: "Crear Servicio",
      csrfToken: req.csrfToken(),
      categorias: categorias,
      precios: precios,
      datos: {}
    });
};

const guardar = async (req, res) => {
  //Validacion
  let resultado = validationResult(req);

  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  if (!resultado.isEmpty()) {
    return res.render("servicios/crear", {
      pagina: "Crear Servicio",
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // Crear un registro
  const {
    titulo,
    descripcion,
    calle,
    lat,
    lng,
    distrito,
    departamento,
    precio: precioId,
    categoria: categoriaId,
  } = req.body;

  const { id: usuarioId } = req.usuario;

  // console.log(req.usuario.id);

  try {
    // Creamos variables
    const servicioGuardado = await Servicios.create({
      titulo: titulo,
      descripcion: descripcion,
      calle: calle,
      lat: lat,
      lng: lng,
      distrito,
      departamento,
      precioId,
      categoriaId,
      usuarioId,
      imagen:  "Imagen01.jpg"
    });
 
    const { id } = servicioGuardado;
   
    res.redirect(`/servicios/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  //Validar que el servicio exista

  const servicio = await Servicios.findByPk(id);

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }


  //Validar que la propiedad no este publicada
  console.log(req.usuario);

  if (servicio.publicado) {
    return res.redirect("/mis-servicios");
  }

  // Validar que la propiedad pertenece a quien visita está página
  if (req.usuario.id.toString() !== servicio.usuarioId.toString()) {
    return res.redirect("/mis-servicios");
  }

  res.render("servicios/agregar-imagen", {
    pagina: `Agregar Imagen: ${servicio.titulo}`,
    csrfToken: req.csrfToken(),
    servicio,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  //Validar que el servicio exista
  const servicio = await Servicios.findByPk(id);

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }

  //Validar que la propiedad no este publicada
  console.log(req.usuario);

  if (servicio.publicado) {
    // req.flash("error","Para modificar la imagen, primero debe de despublicar el servicio")
    return res.redirect("/mis-servicios");
  }

  // Validar que la propiedad pertenece a quien visita está página
  if (req.usuario.id.toString() !== servicio.usuarioId.toString()) {
    return res.redirect("/mis-servicios");
  }

  try {
   
    // Almacenar la imagen y publicar servicio
    servicio.imagen = req.file.filename;
    servicio.publicado = 1;

    await servicio.save();

    next();
    
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  const { id } = req.params;

  // Validar que el servicio exista
  const servicio = await Servicios.findByPk(id);

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }

  // Revisar que quien vistar la URL, es quien creo el servicio
  if (servicio.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-servicios");
  }

  // Modelo de precio y categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("servicios/editar", {
    pagina: `Editar Servicio: ${servicio.titulo}`,
    csrfToken: req.csrfToken(),
    categorias: categorias,
    precios: precios,
    datos: servicio

  });
};

const guardarCambios = async (req, res) => {
  // Verificar la validacion
  let resultado = validationResult(req);

  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  if (!resultado.isEmpty()) {
    return res.render("servicios/editar", {
      pagina: "Editar Servicio",
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    });
  }

  const { id } = req.params;

  // Validar que el servicio exista
  const servicio = await Servicios.findByPk(id);

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }

  // Revisar que quien vistar la URL, es quien creo el servicio
  if (servicio.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-servicios");
  }

  // Reescribir el objeto y actualizar

  try {
    // Reescribir un registro
    const {
      titulo,
      descripcion,
      calle,
      distrito,
      departamento,
      lat,
      lng,
      precio: precioId,
      categoria: categoriaId,
    } = req.body;

    servicio.set({
      titulo,
      descripcion,
      calle,
      distrito,
      departamento,
      lat,
      lng,
      precioId,
      categoriaId,
    });

    await servicio.save();
   
   res.redirect("/mis-servicios");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async(req, res) => {

  const { id } = req.params;

  // Validar que el servicio exista
  const servicio = await Servicios.findByPk(id);

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }

  // Revisar que quien vistar la URL, es quien creo el servicio
  if (servicio.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-servicios");
  }

  // Eliminar la Imagen
  if (servicio.imagen !== "Imagen01.jpg") {
    await unlink(`public/uploads/${servicio.imagen}`)
  }
  // await unlink(`public/uploads/${servicio.imagen}`)

  console.log(`Se elimino la imagen ${servicio.imagen}`);

  // Eliminar el servicio
  await servicio.destroy()

  res.redirect('/mis-servicios')

}
// Modifica el estado de la propiedad
const cambiarEstado = async(req,res)=> {

  // console.log('cambiando estado..');
  const { id } = req.params;

  // Validar que el servicio exista
  const servicio = await Servicios.findByPk(id);

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }

  // Revisar que quien vistar la URL, es quien creo el servicio
  if (servicio.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-servicios");
  }

    //Actualizar
    servicio.publicado = !servicio.publicado

    await servicio.save()

    res.json({
      resultado: true
    })

 
}


// Muestra un servicio
const mostrarServicio = async (req, res) => {
  const  { id } = req.params


  // Comprobar que el serivicio exista
  const servicio = await Servicios.findByPk(id, {
    include : [
      {model : Precio, as: 'precio'},
      {model : Categoria, as: 'categoria'}
    ]
  })

  if(!servicio || !servicio.publicado){
    return res.redirect('/404')
  }

  //console.log(esServidor(req.usuario?.id, servicio.usuarioId));

  res.render('servicios/mostrar', {
      servicio,
      pagina: servicio.titulo,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      esServidor: esServidor(req.usuario?.id, servicio.usuarioId)
  })
}


const enviarMensaje = async(req, res) => {

  const  { id } = req.params

  // Comprobar que el serivicio exista
  const servicio = await Servicios.findByPk(id, {
    include : [
      {model : Precio, as: 'precio'},
      {model : Categoria, as: 'categoria'}
    ]
  })

  if(!servicio){
    return res.redirect('/404')
  }


  // Renderizar los errores
   // Validación
   let resultado = validationResult(req)

   if(!resultado.isEmpty()){

      return   res.render('servicios/mostrar', {
            servicio,
            pagina: servicio.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esServidor: esServidor(req.usuario?.id, servicio.usuarioId),
            errores: resultado.array()
     
      })
      
    }
  
    const { mensaje} = req.body
    const {id: servicioId } = req.params
    const {id: usuarioId} = req.usuario

    // Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        servicioId,
        usuarioId
    })

   
    // res.render('servicios/mostrar', {
    //   servicio,
    //   pagina: servicio.titulo,
    //   csrfToken: req.csrfToken(),
    //   usuario: req.usuario,
    //   esServidor: esServidor(req.usuario?.id, servicio.usuarioId),
    //   enviado: true
    // })

    res.redirect('/')


}


// Leer mensajes recibidos
const verMensajes = async(req, res) => {

  const { id } = req.params;

  // Validar que el servicio exista
  const servicio = await Servicios.findByPk(id, {
    include : [
    { model : Mensaje, as: 'mensajes',

      include : [

      { model: Usuario.scope('eliminarPassword'), as:'usuario'}
      
    ]
    }
    ]
  });

  if (!servicio) {
    return res.redirect("/mis-servicios");
  }

  // Revisar que quien vistar la URL, es quien creo el servicio
  if (servicio.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-servicios");
  }

  res.render('servicios/mensajes', {
    pagina: 'Mensajes',
    mensajes: servicio.mensajes,
    formatearFecha
  })
  
}


export {
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
};

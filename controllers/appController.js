import { Sequelize } from 'sequelize'
import {Precio, Categoria, Servicios} from '../models/index.js'


const inicio = async (req, res) => {


    const [categorias, precios,hospedaje,paseo] = await Promise.all([
        Categoria.findAll({ raw: true}),
        Precio.findAll({raw: true}),
        Servicios.findAll({
            limit:6,
            where:{
                categoriaId:1
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt','DESC']
            ]
        }),
        Servicios.findAll({
            limit:6,
            where:{
                categoriaId:2
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt','DESC']
            ]
        })
    ])

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        hospedaje,
        paseo,
        csrfToken: req.csrfToken()

    })

}



const categoria = async (req, res) => {

    const {id } = req.params

    console.log(id);

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
        return res.redirect('/404')
    }

    // Obtener los servicios de la categoria
    const servicios = await Servicios.findAll({
        where: {
            categoriaId: id
        },
        include:[
            { model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: `Nuestro servicio de ${categoria.nombre}`,
        servicios,
        csrfToken: req.csrfToken()
    })


}

const noEncontrado = (req, res) => {

    res.render('404', {
        pagina: 'No encontrada',
        csrfToken: req.csrfToken()
    })


}


const buscador = async (req, res) => {

    const {termino} = req.body

    // Validar que termino no este vacío
    if(!termino.trim()){
        return res.redirect('back')
    }

    // Consultar los servicios
    const servicios = await Servicios.findAll({

        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include:[
            {model: Precio, as: 'precio'}
        ]
    })

  res.render('busqueda', {
    pagina: 'Resultados de la búsqueda',
    servicios,
    csrfToken: req.csrfToken()

  })
}





export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}
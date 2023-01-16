import {Servicios, Precio, Categoria} from '../models/index.js'

const servicios = async (req, res) => {

    const servicios = await Servicios.findAll({
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'},
        ]
    })

    res.json(servicios)

}

export {
    servicios
}
import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Categoria = db.define('categorias', {

    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    condicion: {
        type: DataTypes.INTEGER(5),
        allowNull: false
    }

});

export default Categoria

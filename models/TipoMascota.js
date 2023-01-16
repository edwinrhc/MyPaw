import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const TipoMascota = db.define('tipo_mascota', {

    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }

});

export default TipoMascota

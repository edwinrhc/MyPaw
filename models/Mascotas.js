import { DataTypes } from 'sequelize'

import db from '../config/db.js'

const Mascotas = db.define('mascotas', {


    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
  
    raza: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    edad: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

export default Mascotas

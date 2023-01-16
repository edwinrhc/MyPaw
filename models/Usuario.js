import {DataTypes} from 'sequelize';
import bcryptjs from 'bcryptjs'
import db from '../config/db.js';

const Usuario = db.define('usuarios',{



    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_contacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING
    },
    confirmado: {

        type: DataTypes.BOOLEAN
    }


}, {
    // Encriptar contraseña funciones agregar
    hooks: {
        beforeCreate: async function(usuario){
            const salt = await bcryptjs.genSalt(10)
            usuario.password = await bcryptjs.hash(usuario.password, salt);
        }
    },
    // funcion para elimianr ciertos campos
    scopes:{
        eliminarPassword : {
            attributes: {
                exclude: ['password','token','confirmado','createdAt','updatedAt']
            }
        }

    }

})

// Métodos personalizado
Usuario.prototype.verificarPassword = function(password){

    return bcryptjs.compareSync(password, this.password);


}

export default Usuario;
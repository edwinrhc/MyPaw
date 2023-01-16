import { exit } from 'node:process'
import categorias from "./categorias.js";
import precios from "./precio.js";
import usuarios from "./usuarios.js";
import mascotas from "./mascotas.js";
import tipo_mascota from './tipoMascota.js';

// Models
import {Categoria, Precio, Usuario, Mascotas, TipoMascota} from '../models/index.js';


import db from "../config/db.js";


const importarDatos = async () => {

    try {
        //Autenticar a la bd
        await db.authenticate()

        // Generar las columnas a la bd
        await db.sync()

        //Insertamos los datos
        await Promise.all([
            Categoria.bulkCreate(categorias), // Inserta todos los datos de categoria
            Precio.bulkCreate(precios), // Inserta los precios
            Usuario.bulkCreate(usuarios),
            // Mascotas.bulkCreate(mascotas),
            TipoMascota.bulkCreate(tipo_mascota)
        ])

        console.log('Datos importados correctamente');
        exit(0) // en cero significa correcto

        
    } catch (error) {
        console.log(error);
        exit(1) //en 1 significa pero existe un error
    }
}

// Eliminar Datos
const eliminarDatos = async () => {
    try {
        // Elimina la tablas en formato truncate Opcion 1
    /*  await Promise.all([
            Categoria.destroy({where: {}, truncate: true}), // Inserta todos los datos de categoria
            Precio.destroy({where: {}, truncate: true}) // Inserta los precios
        ]) */

        // Opción 2 Elimina las tablas formato truncate Opcion 2
        await db.sync({force: true})

        console.log("Datos eliminados");
        exit()

    } catch (error) {
        console.log(error);
        exit(1);
        
    }
}



//  "db:importar":"node ./seed/seeder.js -i" llama desde package.json y el 2 
// es la posicion del arreglo de db:importar
if(process.argv[2] === "-i") {
    importarDatos();
}


if(process.argv[2] === "-e") {
    eliminarDatos();
}
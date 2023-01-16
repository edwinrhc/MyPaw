import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

import usuarioRoutes from './routes/usuarioRoutes.js';
import serviciosRoutes from './routes/serviciosRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

import mascotasRoutes from './routes/mascotasRoutes.js';


import db from './config/db.js';


// Crear la app
const app = express();

//Habilitar lectura de datos del formulario si son tipo texto email etc
app.use( express.urlencoded({extended: true }))

//Habilitar cookieParser
app.use( cookieParser())

// Habilitar CSRF
app.use(csrf({ cookie: true}))

//Conexion a la base de datos
try {
    await db.authenticate();
    //Genere las tablas sync()
    db.sync()
    console.log("Conexion correcta");
} catch (error) {
    console.log(error);
}

// hablitar  Pug
app.set('view engine', 'pug');
//Aqui se encuentra los archivos
app.set('views', './views')


//Carpeta pública
app.use(
    express.static('public')
)



// Routing
app.use('/', appRoutes)
// Use busca todo lo que inicia con una diagonal
app.use('/auth', usuarioRoutes);
app.use('/', serviciosRoutes);
app.use('/api', apiRoutes);

app.use('/',mascotasRoutes);


// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});
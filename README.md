# MyPaw

Este es un proyecto llamado **Reservamascota**, desarrollado con Node.js y Express.js. Es una aplicación web que permite la gestión de reservas para mascotas.

## Tabla de Contenidos
- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts de NPM](#scripts-de-npm)
- [Tecnologías](#tecnologías)
- [Autor](#autor)

## Instalación

1. Clona este repositorio en tu máquina local.
    ```bash
    git clone https://github.com/tu-usuario/reservamascota.git
    ```

2. Navega al directorio del proyecto.
    ```bash
    cd myPaw
    ```

3. Instala las dependencias necesarias.
    ```bash
    npm install
    ```

4. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
    ```
    DB_HOST=tu_host
    DB_USER=tu_usuario
    DB_PASS=tu_contraseña
    DB_NAME=nombre_base_datos
    SECRET_KEY=tu_llave_secreta
    ```

## Uso

Para iniciar la aplicación en modo de desarrollo, usa el siguiente comando:

```bash

npm start: Inicia la aplicación en producción.
npm run server: Inicia la aplicación con nodemon para desarrollo.
npm run css: Compila los archivos CSS con Tailwind.
npm run js: Compila los archivos JavaScript con Webpack.
npm run dev: Ejecuta tanto la compilación de CSS como la de JavaScript en modo de observación.
npm run db:importar: Importa los datos iniciales a la base de datos.
npm run db:eliminar: Elimina los datos de la base de datos.

````

## Tecnologías

Este proyecto utiliza las siguientes tecnologías:

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework web para Node.js, utilizado para crear la API y gestionar las rutas.
- **Pug**: Motor de plantillas para generar el HTML de manera dinámica.
- **Tailwind CSS**: Framework CSS para diseñar interfaces de usuario de manera eficiente.
- **MySQL** (con Sequelize): Base de datos relacional, utilizando Sequelize como ORM para interactuar con la base de datos.
- **JWT** (JsonWebToken): Herramienta para la autenticación basada en tokens.
- **Multer**: Middleware para la gestión de la carga de archivos.
- **Nodemailer**: Módulo para el envío de correos electrónicos desde Node.js.
- **Bcryptjs**: Librería para la encriptación de contraseñas.


## Autor
Edwin HC
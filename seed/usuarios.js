import bcrypt from 'bcryptjs'
const usuarios = [
{
    nombre: 'edwin',
    apellido_paterno: 'Huamanttupa',
    apellido_materno: 'Cuevas',
    numero_contacto: '949493742',
    email: 'correo1@correo.com',
    confirmado:1,
    password: bcrypt.hashSync('123456',10)
},
{
    nombre: 'ricardo',
    apellido_paterno: 'Vivanco',
    apellido_materno: 'Seminario',
    numero_contacto: '949493123',
    email: 'correo2@correo.com',
    confirmado:1,
    password: bcrypt.hashSync('123456',10)
},
{
    nombre: 'dayiro',
    apellido_paterno: 'Roman',
    apellido_materno: 'Farfan',
    numero_contacto: '949493223',
    email: 'correo3@correo.com',
    confirmado:1,
    password: bcrypt.hashSync('123456',10)
}
]

export default usuarios
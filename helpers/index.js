const esServidor = (usuarioId, servicioUsuarioId) => {
    return usuarioId === servicioUsuarioId
}

const formatearFecha = fecha => {

    // console.log(new Date(fecha).toISOString().slice(0,10));
     const nuevaFecha = new Date(fecha).toISOString().slice(0,10)

     const opciones = {
        weekday: 'long',
        year:'numeric',
        month: 'long',
        day: 'numeric'
     }

     return new Date(nuevaFecha).toLocaleDateString('es-Es', opciones)
}

export {
    esServidor,
    formatearFecha
}
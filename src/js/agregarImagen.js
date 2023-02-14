import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

// console.log(token);

Dropzone.options.imagen = {
    dictDefaultMessage: 'Arrastra aquí tu imagen o haz clic para seleccionarla',
    dictInvalidFileType: "Lo siento, solo se permiten imágenes en formato JPG, JPEG o PNG.",
    dictFileTooBig: "El archivo es demasiado grande ({{filesize}}MiB). Máximo tamaño permitido: {{maxFilesize}}MiB.",
    dictCancelUpload: "Cancelar subida",
    dictCancelUploadConfirmation: "¿Estás seguro de que quieres cancelar la subida?",
    dictRemoveFile: "Eliminar archivo",
    dictMaxFilesExceeded: "No puedes subir más archivos.",
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5, //5 megas
    maxFiles:1,

    parallelUploads:1,
    autoProcessQueue: false, // Aqui desactivamos para que no se sube automaticamentete
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite es 1 Archivo',
    headers: { // El header se recagar antes del cuerpo 
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue()
          })

          // dropzone.on('queuecomplete', function(){
          //   if(dropzone.getActiveFiles().length== 0){
          //     window.location.href = '/mis-servicios';
          //   }
          // })


        //  btnPublicar.style.display = "none";

        // dropzone.on("addedfile", function () {
        // if (dropzone.getAcceptedFiles().length <= 1 ) {
        //     btnPublicar.style.display = "block";
        //   } 
        // });


        
        // dropzone.on("removedfile", function () {
        //   // Ocultar el botón cuando se elimina un archivo
        //   if (dropzone.getAcceptedFiles().length <= 1) {
        //     btnPublicar.style.display = "none";
        //   }
        // });

        // dropzone.on("error", function () {
        //   btnPublicar.style.display = "none";
        //   alert("Sólo se permiten archivos JPEG, JPG o PNG. ");
        //   // this.removeFile(file);
        // });




          dropzone.on("queuecomplete", function (file) {
  
            if (dropzone.getAcceptedFiles().length > 0) {
             
                window.location.href = '/mis-servicios';
            }
             else {
              alert("No se han aceptado archivos válidos para procesar");
              this.removeFile(file);
              btnPublicar.style.display = "none";
            }
          });

    }
}
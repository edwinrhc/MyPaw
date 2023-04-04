(function () {
  // logical OR
  const lat = -12.0331056;
  const lng = -76.9994417;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 12);

  let markers = new L.FeatureGroup().addTo(mapa);

//   console.log(markers);

  let servicios = [];

  // Filtros
  const filtros = {
    categoria: '',
    precio: '',
  };

  const categoriasSelect = document.querySelector("#categorias");
  const preciosSelect = document.querySelector("#precios");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Filtrados de categorias y precios
  categoriasSelect.addEventListener("change", (e) => {
    filtros.categoria = +e.target.value;
    // console.log(+e.target.value);
    filtrarServicios();
    
  });

  preciosSelect.addEventListener("change", (e) => {
    filtros.precio = +e.target.value;
    // console.log(+e.target.value);
    filtrarServicios();
  });

  const obtenerServicios = async () => {
    try {
      const url = "/api/servicios";
      const respuesta = await fetch(url);
      servicios = await respuesta.json();

      mostrarServicios(servicios);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarServicios = (servicios) => {


    // Limpiar los markers previos
    markers.clearLayers()


    servicios.forEach((servicio) => {
      // console.log(servicio);
      // Agregar pines
      const marker = new L.marker([servicio?.lat, servicio?.lng], {
        autoPan: true,
      }).addTo(mapa).bindPopup(`
                <p class=" text-indigo-600 font-bold">${servicio.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${servicio?.titulo}</h1>
                <a href="/servicio/${servicio.id}" class="bg-indigo-400 block p-1 text-center font-bold rounded"> <img class="h-32" src="/uploads/${servicio?.imagen}" alt="Imagen del servicio ${servicio?.titulo}"> </a>
                <p class=" text-gray-600 font-bold">${servicio.precio.nombre}</p>
                <p class=" text-indigo-600 font-bold">${servicio.calle}</p>
                <a href="/servicio/${servicio.id}" class="bg-indigo-600 block p-2 text-center font-bold rounded">Ver Servicio</a>
            
            `);

      markers.addLayer(marker);
    });
  };


  const filtrarServicios = () => {
    
  
    const resultado = servicios.filter(filtrarCategoria).filter(filtrarPrecio)
     mostrarServicios(resultado)
  }

  const filtrarCategoria  = (servicio) => {
    return filtros.categoria ? servicio.categoriaId === filtros.categoria : servicio
  }

  const filtrarPrecio  = (servicio) => {
    return filtros.precio ? servicio.precioId === filtros.precio : servicio
  }

  obtenerServicios();
})();

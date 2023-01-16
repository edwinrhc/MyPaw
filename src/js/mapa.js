(function() {
    // logical OR
    const lat = document.querySelector('#lat').value || -12.0331056;
    const lng = document.querySelector('#lng').value || -76.9994417;
    const mapa = L.map('mapa').setView([lat, lng ], 11);

    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // EL Pin
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true

    })
    .addTo(mapa)

    // Detectar el movimiento del pin 
    marker.on('moveend', function(e){
        marker = e.target
        // console.log(marker);
        const posicion  = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));


        //Obtener la información de la calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 15).run(function (error, resultado){
            console.log(resultado);

            marker.bindPopup(resultado.address.LongLabel)

            // Llenar los campos
            // document.querySelector('.calle').textContent = resultado?.address?.LongLabel ?? '';
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';

            document.querySelector('.distrito').textContent = resultado?.address?.City ?? '';
            document.querySelector('#distrito').value = resultado?.address?.City ?? '';

            document.querySelector('.departamento').textContent = resultado?.address?.Region ?? '';
            document.querySelector('#departamento').value = resultado?.address?.Region ?? '';

            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })

    })


})()
//En este script, se obtienen los datos de la API de OpenWeather.
let nombreCiudad = document.querySelector('.city-name');
let buscador = document.getElementById('search-bar');
let formBuscador = document.getElementById('search-form');
let contenedorTarjetas = document.querySelector('.card-wrapper');
let checkbox = document.getElementById('check');
let inputDias = document.getElementById('cantDias');


//Se muestran los datos en el HTML
const mostrarDatos = (datos) => {

    let fechaActual = new Date(datos['fechaHoy']).getDate();

    //Se setea el titulo con el nombre de la ciudad
    nombreCiudad.innerHTML = datos['nombreCiudad'];

    contenedorTarjetas.innerHTML = "";

    for (let i = 0; i < Object.keys(datos).length - 1; i++) {

        let key = Object.keys(datos)[i];

        contenedorTarjetas.innerHTML += `
                    <div class="card">
                    <h2 class="day-name">${datos[key][0]}</h2>
                    <div class="day-icon">
                        <img src="/assets/images/icons/${datos[key][3]}.png" alt="" srcset="">
                    </div>
                    <div class="temp">
                        <p class="temp-text">MÁX: ${datos[key][2]} </p>
                        <p class="temp-text">MIN: ${datos[key][1]} </p>
                    </div>
                </div>
       `;
    }
}


const getClima = (ciudad) => {

    let api_url = `/api/${ciudad}`;

    fetchServer(api_url);
}


const getClimaDias = (nombreCiudad, cantDias) => {

    let api_url = `/api/filtrar/${nombreCiudad}?dias=${cantDias}`

    fetchServer(api_url);
}


const fetchServer = async (api_url) => {

    const response = await fetch(api_url);


    if (response.status === 404) {

        nombreCiudad.innerHTML = 'No se encontró la ciudad';
        contenedorTarjetas.innerHTML = '';

    } else if (response.status === 400) {

        nombreCiudad.innerHTML = 'Error 400 - Bad Request';
        contenedorTarjetas.innerHTML = '';

    } else {

        const json = await response.json();
        mostrarDatos(json);
    }


}



formBuscador.addEventListener("submit", e => {
    e.preventDefault();

    checkbox.checked ? getClimaDias(buscador.value, inputDias.value) : getClima(buscador.value);

});

//Al cargarse la ventana, por defecto se seleccionará Neuquén
window.onload = async () => {
    getClima('Neuquén');
}


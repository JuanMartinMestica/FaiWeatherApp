//En este script, se obtienen los datos de la API de OpenWeather.
let nombreCiudad = document.querySelector('.city-name');
let buscador = document.getElementById('search-bar');
let formBuscador = document.getElementById('search-form');
let contenedorTarjetas = document.querySelector('.card-wrapper');
const diaSemana = ['Sabado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

//Se muestran los datos en el HTML
const mostrarDatos = (fecha, ciudad, temperaturas) => {

    let fechaActual = new Date(fecha).getDate();

    //Se setea el titulo con el nombre de la ciudad
    nombreCiudad.innerHTML = ciudad;

    contenedorTarjetas.innerHTML = "";

    for (let i = fechaActual; i <= fechaActual + 4; i++) {
        contenedorTarjetas.innerHTML += `
                    <div class="card">
                    <h2 class="day-name">${temperaturas[i][0]}</h2>
                    <div class="day-icon">
                        <img src="/assets/images/icons/${temperaturas[i][3]}.png" alt="" srcset="">
                    </div>
                    <div class="temp">
                        <p class="temp-text">MÁX: ${temperaturas[i][2]} </p>
                        <p class="temp-text">MIN: ${temperaturas[i][1]} </p>
                    </div>
                </div>
       `;
    }
}


const obtenerDias = (datos) => {

    //Variables
    var i = 0;
    var j = 0;
    var dias = datos.list;
    var dict = {};
    var maxDia = 0;
    var minDia = 100;

    while (dias[i]) {

        //Se obtiene la fecha de hoy 
        var fechaAux = new Date(dias[j].dt_txt);
        var fechaIndice = new Date(dias[i].dt_txt);

        var nroAuxDia = fechaAux.getDate();
        var nroIndice = fechaIndice.getDate();

        //Se obtiene el icono
        var codIcono = dias[j].weather[0].icon;

        if (nroAuxDia == nroIndice) {

            //Verificar temperaturas minimas y máximas
            var maxJson = dias[i].main.temp_max;
            if (maxJson > maxDia) {
                maxDia = maxJson;
            }
            var minJson = dias[i].main.temp_min;
            if (minJson < minDia) {
                minDia = minJson;
            }

        } else {

            j = i;

            var dia = diaSemana[fechaIndice.getDay()];

            //Se crea entrada con la máxima y mínima 
            dict[nroAuxDia] = [dia, minDia, maxDia, codIcono];

            minDia = 100;
            maxDia = 0;
        }
        i++;
    }

    return dict;

}


const getClima = async (ciudad) => {

    api_url = `/api/${ciudad}`;

    const response = await fetch(api_url);


    if (response.status === 404) {

        nombreCiudad.innerHTML= 'No se encontró la ciudad';
        contenedorTarjetas.innerHTML = '';

    } else {

        const json = await response.json();

        let info = obtenerDias(json);

        mostrarDatos(json.list[0].dt_txt, json.city.name, info);
    }


}


formBuscador.addEventListener("submit", e => {
    e.preventDefault();
    getClima(buscador.value);
});

//Al cargarse la ventana, por defecto se seleccionará Neuquén
window.onload = async () => {
    getClima('Neuquén');
}


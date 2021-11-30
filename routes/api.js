const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const tools = require('../src/tools');

require('dotenv').config();

//Variable global que almacena los datos
let datos = {};

router.post('/ciudades/:nombreCiudad', async (req, res) => {
    
    const nombreCiudad = req.params.nombreciudad;

    if (datos[nombreCiudad] === undefined) {

        const fetchres = await fetchAPI(nombreCiudad);

        if (fetchres.status !== 404) {
            const json = await fetchres.json();
            datos[nombreCiudad] = [json, Date.now()];
        }
    }
})

//Request de clima a partir de un nombre de ciudad
router.get('/:nombreciudad', async (req, res) => {

    //Se extrae el nombre de ciudad
    const nombreCiudad = req.params.nombreciudad;

    //Se verifica si no existe en el diccionario la ciudad solicitada
    if (datos[nombreCiudad] === undefined) {

        let fetchres = await fetchAPI(nombreCiudad);

        //Se chequea si la API retorna 404 y se retorna al script del frontend
        if (fetchres.status === 404) {
            res.status(404).send('Not found');
        } else {

            //Si no existe error, se obtiene el json y se almacena en la variable global
            const json = await fetchres.json();

            //Se limpian los datos
            const datosLimpios = tools.limpiarDatos(json);

            /*En el diccionario global, se almacena un timestamp de la consulta y el json 
            con los datos del clima para la ciudad */
            datos[nombreCiudad] = [datosLimpios, Date.now()];

            //Se retornan los datos correspondientes
            res.json(datos[nombreCiudad][0]);

        }
    } else {

        //Se obtiene el timestamp de cuando se hizo la consulta
        let timestamp = datos[nombreCiudad][1];
        let hs = 3;
        let cantMs = hs * 3600000;

        //Se verifica si pasaron 3 horas desde la última consulta
        if (Date.now() - timestamp > cantMs) {

            /*Si pasaron más de 3 horas desde la anterior consulta 
            entonces se hace una nueva consulta y se actualiza el diccionario local*/
            let fetchres = await fetchAPI(nombreCiudad);

            const json = await fetchres.json();

            const datosLimpios = tools.limpiarDatos(json)

            datos[nombreCiudad] = [datosLimpios, Date.now()];

                //Se retornan los datos correspondientes
                  res.json(datos[nombreCiudad][0]);

        }
    }


});

const fetchAPI = async (nombreCiudad) => {

    const fetchres = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${nombreCiudad}&units=metric&lang=sp`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": process.env.API_KEY
        }
    });

    return fetchres;

}


module.exports = router;
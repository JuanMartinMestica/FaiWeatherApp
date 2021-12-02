const { Router } = require('express');
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const tools = require('../src/tools');
const validation = require('../src/validations');

require('dotenv').config();

//Variable global que almacena los datos
let datos = {};

router.post('/:nombreciudad', async (req, res) => {

    const nombreCiudad = req.params.nombreciudad;

    if (datos[nombreCiudad] === undefined) {

        const fetchres = await fetchAPI(nombreCiudad);

        if (fetchres.status !== 404) {
            
            await almacenarDatos(fetchres, nombreCiudad);
            res.send('Ciudad almacenada correctamente');
            console.log(datos);
        }
    }
})

//Request de clima a partir de un nombre de ciudad
router.get('/:nombreciudad', validation.validate(validation.checkCiudad), async (req, res) => {

    //Se extrae el nombre de ciudad
    const nombreCiudad = req.params.nombreciudad;

    //Se verifica si no existe en el diccionario la ciudad solicitada
    if (datos[nombreCiudad] === undefined) {

        let fetchres = await fetchAPI(nombreCiudad);

        //Se chequea si la API retorna 404 y se retorna al script del frontend
        if (fetchres.status === 404) {
            res.status(404).send('Not found');
        } else {

            await almacenarDatos(fetchres, nombreCiudad);

            //Se retornan los datos correspondientes
            res.json(datos[nombreCiudad][0]);

        }
    } else {

        //Se verifica si pasaron 3 horas desde la última consulta
        if (verificarTimestamp(nombreCiudad)) {

            let fetchres = await fetchAPI(nom);
            /*Si pasaron más de 3 horas desde la anterior consulta 
            entonces se hace una nueva consulta y se actualiza el diccionario local*/
            await almacenarDatos(fetchres, nom);
        }

        //Se retornan los datos correspondientes
        res.json(datos[nombreCiudad][0]);

    }

});


//Query
router.get('/filtrar/:nombreciudad', validation.validate(validation.checkCiudad), async (req, res) => {

    const dias = req.query.dias;
    const nombreCiudad = req.params.nombreciudad;

    //Se verifica si no existe en el diccionario la ciudad solicitada
    if (datos[nombreCiudad] === undefined) {

        let fetchres = await fetchAPI(nombreCiudad);

        //Se chequea si la API retorna 404 y se retorna al script del frontend
        if (fetchres.status === 404) {
            res.status(404).send('Not found');
        } else {

            await almacenarDatos(fetchres, nombreCiudad);

            let diasSolicitados = tools.obtenerDias(dias, datos[nombreCiudad][0]);

            res.json(diasSolicitados);

        }
    } else {

        //Se verifica si pasaron 3 horas desde la última consulta
        if (verificarTimestamp(nombreCiudad)) {

            let fetchres = await fetchAPI(nombreCiudad);
            /*Si pasaron más de 3 horas desde la anterior consulta 
            entonces se hace una nueva consulta y se actualiza el diccionario local*/
            await almacenarDatos(fetchres, nombreCiudad);

        }

        let diasSolicitados = tools.obtenerDias(dias, datos[nombreCiudad][0]);

        //Se retornan los datos correspondientes
        res.json(diasSolicitados);

    }

});


const almacenarDatos = async (fetchres, nombreCiudad) => {

    const json = await fetchres.json();

    const datosLimpios = tools.limpiarDatos(json);

    datos[nombreCiudad] = [datosLimpios, Date.now()];


}

const verificarTimestamp = (nombre) => {

    //Se obtiene el timestamp de cuando se hizo la consulta
    let timestamp = datos[nombre][1];
    let hs = 3;
    let cantMs = hs * 3600000;

    return Date.now() - timestamp > cantMs
}


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
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

require('dotenv').config();

//Variable global que almacena los datos
let datos = {};

router.post('/ciudades/:nombreCiudad', async (req, res) => {

    const nombreCiudad = req.params.nombreciudad;

    if (datos[nombreCiudad] === undefined) {

        const fetchres = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${nombreCiudad}&units=metric&lang=sp`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key": process.env.API_KEY
            }
        });

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

        const fetchres = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${nombreCiudad}&units=metric&lang=sp`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key": process.env.API_KEY
            }
        });

        //Se chequea si la API retorna 404 y se retorna al script del frontend
        if (fetchres.status === 404) {
            res.status(404).send('Not found');
        } else {

            //Si no existe error, se obtiene el json y se almacena en la variable global
            const json = await fetchres.json();

            /*En el diccionario global, se almacena un timestamp de la consulta y el json 
            con los datos del clima para la ciudad */
            datos[nombreCiudad] = [json, Date.now()];

            res.json(json);
        }
    } else {
        

        res.json(datos[nombreCiudad][0]);

    }
});


module.exports = router;
//Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fetch = require('node-fetch');
let request = require('request');
let datos = {};



app.listen(port, () => {
    console.log(port);
});

//Sirviendo html-css-js
app.use(express.static(__dirname + '/public'));

app.post('/api/ciudades/:nombreCiudad', async (req, res) => {

    const nombreCiudad = req.params.nombreciudad;

    if(datos[nombreCiudad] === undefined){

        const fetchres = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${nombreCiudad}&units=metric&lang=sp`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key": "8c2baee70fmshd1a1b23c7bc7b0dp1008a3jsn256f6f9b7a14"
            }
        });

        if(fetchres.status !== 404){
            const json = await fetchres.json();
            datos[nombreCiudad] = [json, Date.now()];
        }
    }
})

//Request de clima a partir de un nombre de ciudad
app.get('/api/:nombreciudad', async (req, res) => {

    //Se extrae el nombre de ciudad
    const nombreCiudad = req.params.nombreciudad;

    //Se verifica si no existe en el diccionario la ciudad solicitada
    if (datos[nombreCiudad] === undefined) {


        //Consultar timestamp?

        const fetchres = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${nombreCiudad}&units=metric&lang=sp`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key": "8c2baee70fmshd1a1b23c7bc7b0dp1008a3jsn256f6f9b7a14"
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


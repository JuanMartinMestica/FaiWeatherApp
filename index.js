//Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fetch = require('node-fetch');
let request = require('request');


app.listen(port, ()=>{
    console.log(port);
});

//Sirviendo html-css-js
app.use(express.static(__dirname + '/public'));


app.get('/api/:nombreciudad', async (req,res) =>{

    const nombreCiudad = req.params.nombreciudad;

    const fetchres = await fetch (`https://community-open-weather-map.p.rapidapi.com/forecast?q=${nombreCiudad}&units=metric&lang=sp`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "8c2baee70fmshd1a1b23c7bc7b0dp1008a3jsn256f6f9b7a14"}});

    if(fetchres.status === 404){
        res.status(404).send('Not found');
    } else{
        const json = await fetchres.json();
        res.json(json);
    }
});
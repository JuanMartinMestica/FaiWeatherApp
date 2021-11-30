//Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//Se obtiene la ruta /api de la carpeta routes
const apiRoute = require('./routes/api');

//Se pasan los llamados a /api a la ruta correspondiente
app.use('/api', apiRoute);

//Sirviendo html-css-js
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(port);
});




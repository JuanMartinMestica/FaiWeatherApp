function validate(validation) {
    return (req, res, next) => {
        try {
            validation(req);
            next();
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
}


function checkCiudad(data) {
  
    const nombreCiudad = data.params.nombreciudad;

    if (typeof nombreCiudad !== 'string' || !/^[a-zA-Záéíóú]+$/i.test(nombreCiudad)) {
        throw new Error('El nombre debe contener unicamente letras.');
    } 
}

module.exports = {
    validate,
    checkCiudad,
};
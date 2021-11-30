function validate(validation) {
    return (req, res, next) => {
        try {
            validation(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}


function checkCiudad(data) {
    const {
        nombreCiudad
    } = data;

    if (typeof nombreCiudad !== 'string' || !/^[a-z]+$/i.test(nombreCiudad)) {
        throw new Error('El nombre debe contener unicamente letras.');
    }
}

module.exports = {
    validate,
    checkCiudad,
};
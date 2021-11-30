const diaSemana = ['Sabado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

module.exports = {

    limpiarDatos: function (datos){

        //Variables
        let i = 0;
        let j = 0;
        let dias = datos.list;
        let dict = {};
        let maxDia = 0;
        let minDia = 100;
    
    
        dict['nombreCiudad'] = datos.city.name;
        dict['fechaHoy'] = datos.list[0].dt_txt;

        while (dias[i]) {
    
            //Se obtiene la fecha de hoy 
            let fechaAux = new Date(dias[j].dt_txt);
            let fechaIndice = new Date(dias[i].dt_txt);
    
            let nroAuxDia = fechaAux.getDate();
            let nroIndice = fechaIndice.getDate();
    
            //Se obtiene el icono
            let codIcono = dias[j].weather[0].icon;
    
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
    
                let dia = diaSemana[fechaIndice.getDay()];
    
                //Se crea entrada con la máxima y mínima 
                dict[nroAuxDia] = [dia, minDia, maxDia, codIcono];
    
                minDia = 100;
                maxDia = 0;
            }
            i++;
        }

        return dict;
    
    }

}
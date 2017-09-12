'use strict'

/**
* extrae los parametros especificos de un objeto
* @param {String[]} parametros - parametros a extraer
* @param {Object} json - objeto del cual se extraeran los parametros especificados
*/
function minimizarObjeto(parametros, json) {
    var newJson = {};
    for (let i = 0; i < parametros.length; i++) {
        if(json[parametros[i]]) {
            newJson[parametros[i]] = json[parametros[i]];
        }
    }
    return newJson;
}

/**
* valida que se encuentre alguno de los parametros indicados en "parametros"
* dentro del objetos json
* @param {String[]} parametros
* @param {Object} json
* @return {Boolean}
*/
function orValidate(parametros, json) {
    for (let i = 0; i < parametros.length; i++) {
        if (json[parametros[i]]) return true;
    }
}

/**
* valida que se encuentre todos de los parametros indicados en "parametros"
* dentro del objetos json
* @param {String[]} parametros
* @param {Object} json
* @return {Boolean}
*/
function andValidate(parametros, json) {
    for (let i = 0; i < parametros.length; i++) {
        if (!json[parametros[i]]) return false;
    }
}

module.exports = {
    minimizarObjeto
}

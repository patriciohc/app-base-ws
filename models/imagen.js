'use strict'
/*
* imagen
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "image";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "id_cliente",
        type: "INT"
    }, {
        name: "url",
        type: "VARCHAR(250)"
    }, {
        name: "type_image",
        type: "VARCHAR(100)"
    }
]

var obj = new Model(name, columns);

function sync () {
    return obj.createTable();
}

/**
 * guarda nuevo poligono
 * @param {string} idUnidad id de la unidad al que pertenece el poligono
 * @param {string} kml nombre de kml del poligono
 * @returns {Promise}
 */
function create (id_cliente, url, type_image) {
    return obj.create({id_cliente, url, type_image});
}

// obtiene un poligono con todas sus cordenadas
function findOne(id_unidad) {

}

function findAll (query) {
    return obj.findAll(query);
}

function deleteR (idUnidad) {
    return obj.deleteR({id_unidad: idUnidad});
}

module.exports = {
    sync,
    create,
    deleteR,
    findOne,
    findAll
}

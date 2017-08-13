'use strict'
/*
* Poligono que conrresponde a un establecimiento
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "poligono";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "lat",
        type: "DOUBLE"
    }, {
        name: "lng",
        type: "DOUBLE"
    }
]

var poligono = new Model(name, columns);

function sync () {
    return poligono.createTable();
}

/**
 * guardaa nuevo poligono
 * @param {string} idUnidad id de la unidad al que pertenece el poligono
 * @param {Position[]} puntos array de posiciones lat, lng
 * @returns {Promise}
 */
function create (idUnidad, puntos) {
    var values = [];
    for (let i = 0; i < puntos.length; i ++) {
        values.push([
            idUnidad,
            puntos[i].lat,
            puntos[i].lng
        ]);
    }
    return poligono.insertBulk(values, 'id_unidad, lat, lng');
}

function findOne (query) {
    return unidad.findOne(query);
}

function findAll (query) {
    return unidad.findAll(query);
}

function findById (id) {
    return unidad.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: unidad.addRelation,
}

'use strict'
/*
* Unidad representa un establecimiento, consultorio, local ect.
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "direccion";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre_direccion",
        type: "VARCHAR(250)"
    }, {
        name: "estado",
        type: "VARCHAR(100)"
    }, {
        name: "direccion", // municipio, colonia, calle, numero
        type: "VARCHAR(200)"
    }, {
        name: "lat", // latitud
        type: "DOUBLE"
    }, {
        name: "lng", // longitud
        type: "DOUBLE"
    }, {
        name: "referencia", // referencia para encontrar establecimiento
        type: "VARCHAR(200)"
    }, {
        name: "id_usuario",
        type: "INT NOT NULL"
    }
]

var direccion = new Model(name, columns);

function sync () {
    return direccion.createTable();
}

function create (obj) {
    return direccion.create(obj);
}

function findOne (query) {
    return direccion.findOne(query);
}

function findAll (query) {
    return direccion.findAll(query);
}

function findById (id) {
    return direccion.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: direccion.addRelation,
}

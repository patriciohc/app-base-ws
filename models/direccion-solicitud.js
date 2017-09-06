'use strict'
/*
* DireccionSolicitud: es la direccion de donde el usuario a solicitado el servicio
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "direccion_solicitud";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre_direccion",
        type: "VARCHAR(250)"
    }, {
        name: "direccion", // municipio, colonia, calle, numero (string que regresa api google maps)
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
        type: "INT"
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
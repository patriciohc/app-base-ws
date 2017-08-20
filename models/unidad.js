'use strict'
/*
* Unidad representa un establecimiento, consultorio, local ect.
*
*/
var Model = require('./model');
var Poligono = require('./poligono');
// nombre de la tabla en db
const name = "unidad";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "estado",
        type: "VARCHAR(100)"
    }, {
        name: "municipio",
        type: "VARCHAR(100)"
    }, {
        name: "direccion", // colonia, calle, numerovarchar(100)
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
        name: "telefono",
        type: "VARCHAR(20)"
    }, {
        name: "hora_apetura",
        type: "TIME"
    }, {
        name: "hora_cierre",
        type: "TIME"
    }, {
        name: "estatus",
        type: "TINYINT"
    }, {
        name: "id_cliente", // dueño establecimiento
        type: "INT NOT NULL"
    }, {
        name: "file_kml",
        type: "VARCHAR(250)"
    }
]

var unidad = new Model(name, columns);

function sync () {
    return unidad.createTable();
}

function create (obj) {
    return unidad.create(obj);
}

function findOne (query) {
    var unidad;
    unidad.findOne(query)
    .then(function (result) {
        unidad = result;
        return Poligono.findOne(result.id);
    })
    .then(function (result) {

    })
    .catch(function () {

    });
}

/**
* Regresa todas las unidades que se encuentran a una determinada distancia de lat, lng
* @param {float} lat - latitud
* @param {float} lng - longitud
* @param {float} distancia - distancia
* @return {array} array de tipo Unidad
*/
function findPorDistancia (lat, lng, distancia) {

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

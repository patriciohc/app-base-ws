'use strict'
/*
* OperadorEntrea representa un usuario repartidor
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "operador";
// columnas de valor unico
const uniques = ['correo_electronico'];
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre",
        type: "VARCHAR(250) NOT NULL"
    }, {
        name: "apellido_paterno",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "apellido_materno",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "correo_electronico",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "password",
        type: "VARCHAR(50) NOT NULL"
    }, {
        name: "rol",
        // 1 repartidor,
        // 2 operador de unidad
        // 3 administrador
        type: "TINYINT NOT NULL"
    }, {
        name: "foto",
        type: "VARCHAR(100)"
    }, {
        name: "estatus",
        type: "TINYINT"
    }
]

var operador = new Model(name, columns);

function sync () {
    return operador.createTable();
}

function create (obj) {
    return operador.create(obj);
}

function findOne (query) {
    return operador.findOne(query);
}

function findAll (query) {
    return operador.findAll(query);
}

function findById (id) {
    return operador.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: operador.addRelation,
}

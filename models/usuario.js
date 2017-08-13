'use strict'
/*
* Usuario que usa la app de compra
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "usuario";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "correo_electronico",
        type: "VARCHAR(250)"
    }, {
        name: "nombre",
        type: "VARCHAR(100)"
    }, {
        name: "password",
        type: "varchar(100)"
    }, {
        name: "telefono", // telefono movil
        type: "varchar(200)"
    }, {
        name: "recibir_promociones",
        type: "TINYINT" // 1 true, 0 false 
    },
]

var usuario = new Model(name, columns);

function sync () {
    return usuario.createTable();
}

function create (obj) {
    return usuario.create(obj);
}

function findOne (query) {
    return usuario.findOne(query);
}

function findAll (query) {
    return usuario.findAll(query);
}

function findById (id) {
    return usuario.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
}

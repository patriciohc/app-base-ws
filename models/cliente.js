'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "cliente";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "razon_social",
        type: "VARCHAR(250)"
    }, {
        name: "representante_legal",
        type: "VARCHAR(100)"
    }, {
        name: "telefono",
        type: "varchar(100)"
    }, {
        name: "direccion", // dirreccion completa
        type: "varchar(200)"
    }
]

var cliente = new Model(name, columns);

function sync () {
    return cliente.createTable();
}

function create (obj) {
    return cliente.create(obj);
}

function findOne (query) {
    return cliente.findOne(query);
}

function findAll (query) {
    return cliente.findAll(query);
}

function findById (id) {
    return cliente.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
}

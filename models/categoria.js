'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "categoria";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "descripcion",
        type: "VARCHAR(100)"
    }, {
        name: "imagen",
        type: "VARCHAR(100)"
    }, {
        name: "id_unidad",
        type: "INT"
    }
]

var categoria = new Model(name, columns);

function sync () {
    return categoria.createTable();
}

function create (obj) {
    return categoria.create(obj);
}

function findOne (query) {
    return categoria.findOne(query);
}

function findAll (query) {
    return categoria.findAll(query);
}

function findById (id) {
    return categoria.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
}

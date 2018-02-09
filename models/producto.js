'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "producto";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "codigo",
        type: "VARCHAR(100)"
    }, {
        name: "descripcion",
        type: "VARCHAR(100)"
    }, {
        name: "precio",
        type: "FLOAT"
    }, {
        name: "precio_publico",
        type: "FLOAT"
    }, {
        name: "imagen",
        type: "VARCHAR(100)"
    }, {
        name: "id_categoria",
        type: "INT NOT NULL"
    }, {
        name: "id_cliente",
        type: "INT NOT NULL"
    }
]

var producto = new Model(name, columns);

function sync () {
    return producto.createTable();
}

function create (obj) {
    return producto.create(obj);
}

function findOne (query) {
    return producto.findOne(query);
}

function findAll (query) {
    return producto.findAll(query);
}

function findById (id) {
    return producto.findById(id);
}

function deleteR (query) {
    return producto.deleteR(query.where);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: producto.addRelation,
    deleteR,
}

'use strict'
/*
* productos que tiene cada unidad
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "unidad_producto";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "id_cliente",
        type: "VARCHAR(250)"
    }, {
        name: "id_producto",
        type: "VARCHAR(100)"
    }
]

var unidadProducto = new Model(name, columns);

function sync () {
    return unidadProducto.createTable();
}

function create (obj) {
    return unidadProducto.create(obj);
}

function findOne (query) {
    return unidadProducto.findOne(query);
}

function findAll (query) {
    return unidadProducto.findAll(query);
}

function findById (id) {
    return unidadProducto.findById(id);
}

function insertBulk (columns, values) {
    return unidadProducto.insertBulk (columns, values);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: categoria.addRelation,
    insertBulk
}

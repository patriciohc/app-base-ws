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
        name: "id_unidad",
        type: "INT"
    }, {
        name: "id_producto",
        type: "INT"
    }
]

var unidadProducto = new Model(name, columns);

function sync () {
    return unidadProducto.createTableLlaveCompuesta('id_unidad', 'id_producto');
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

function findAllProductos (id_unidad) {
  var query = `SELECT * FROM producto p
    INNER JOIN unidad_producto up ON up.id_producto = p.id
    WHERE up.id_unidad = ${id_unidad}`
    return unidadProducto.rawQuery(query);
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
    addRelation: unidadProducto.addRelation,
    insertBulk,
    findAllProductos
}

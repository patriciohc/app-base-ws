'use strict'
/*
* productos que tiene cada unidad
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "unidad_operador";
// columnas en db
const columns = [
    {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "id_operador",
        type: "INT"
    }, {
        name: "rol",
        type: "INT"
    }
]

var unidadOperador = new Model(name, columns);

function sync () {
    return unidadOperador.createTableLlaveCompuesta('id_unidad', 'id_operador');
}

function create (obj) {
    return unidadOperador.create(obj);
}

function findOne (query) {
    return unidadOperador.findOne(query);
}

function findAll (query) {
    return unidadOperador.findAll(query);
}

function findAllOperadores (id_unidad) {
  var query = `SELECT * FROM operador o
    INNER JOIN unidad_operador uo ON uo.id_operador = o.id
    WHERE uo.id_unidad = ${id_unidad}`
    return unidadOperador.rawQuery(query);
}

function findById (id) {
    return unidadOperador.findById(id);
}

function insertBulk (columns, values) {
    return unidadOperador.insertBulk (columns, values);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: unidadOperador.addRelation,
    insertBulk,
    findAllOperadores
}

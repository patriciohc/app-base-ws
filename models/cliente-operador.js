'use strict'
/*
* operadores que tiene un cliente (administrador principal)
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "cliente_operador";
// llave compuesta
const keys = ["id_cliente", "id_operador"];
// columnas en db
const columns = [
    {
        name: "id_cliente",
        type: "INT"
    }, {
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

var model = new Model(name, columns);

function sync () {
    return model.createTableLlaveCompuesta('id_unidad', 'id_operador');
}

function create (obj) {
    return model.create(obj);
}

function findOne (query) {
    return model.findOne(query);
}

function findAll (query) {
    return model.findAll(query);
}

function findAllOperadores (id_cliente) {
  var query = `SELECT * FROM operador o
    INNER JOIN cliente_operador co ON co.id_operador = o.id
    WHERE co.id_cliente = ${id_cliente}`
    return model.rawQuery(query);
}

function findById (id) {
    return model.findById(id);
}

function insertBulk (columns, values) {
    return model.insertBulk (columns, values);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: model.addRelation,
    insertBulk,
    findAllOperadores
}

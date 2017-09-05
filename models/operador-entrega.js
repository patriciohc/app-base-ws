'use strict'
/*
* OperadorEntrea representa un usuario repartidor
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "operador_entrega";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "apellido_paterno",
        type: "VARCHAR(100)"
    }, {
        name: "apellido_materno",
        type: "VARCHAR(100)"
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "foto",
        type: "VARCHAR(100)"
    }, {
        name: "estatus",
        type: "TINYINT"
    }
]

var operadorEntrega = new Model(name, columns);

function sync () {
    return operadorEntrega.createTable();
}

function create (obj) {
    return operadorEntrega.create(obj);
}

function findOne (query) {
    return operadorEntrega.findOne(query);
}

function findAll (query) {
    return operadorEntrega.findAll(query);
}

function findById (id) {
    return operadorEntrega.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: operadorEntrega.addRelation,
}

'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "lista_pedido";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "id_pedido",
        type: "VARCHAR(250)"
    }, {
        name: "id_producto",
        type: "VARCHAR(100)"
    }
]

var listaPedido = new Model(name, columns);

function sync () {
    return listaPedido.createTable();
}

function create (obj) {
    return listaPedido.create(obj);
}

function findOne (query) {
    return listaPedido.findOne(query);
}

function findAll (query) {
    return listaPedido.findAll(query);
}

function findById (id) {
    return listaPedido.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: listaPedido.addRelation,
}

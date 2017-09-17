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
        type: "INT NOT NULL"
    }, {
        name: "id_producto",
        type: "INT NOT NULL"
    }, {
        name: "cantidad",
        type: "INT"
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

function insertBulk (columns, values) {
    return listaPedido.insertBulk (columns, values);
}

function findAllListaPedido (id_pedido) {
  var query = `SELECT * FROM producto p
    INNER JOIN lista_pedido lp ON lp.id_producto = p.id
    WHERE lp.id_pedido = ${id_pedido}`
    return unidadProducto.rawQuery(query);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    insertBulk,
    addRelation: listaPedido.addRelation,
    findAllListaPedido
}

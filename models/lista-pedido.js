'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('../libs/drive-db/model');
// nombre de la tabla en db
const name = "lista_pedido";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
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

var model = new Model(name, columns);

model.findAllListaPedido = function(id_pedido) {
  var query = `SELECT * FROM producto p
    INNER JOIN lista_pedido lp ON lp.id_producto = p.id
    WHERE lp.id_pedido = ${id_pedido}`
    return this.rawQuery(query);
}

module.exports = model;

'use strict'
/*
* operadores que tiene un cliente (administrador principal)
*
*/
var Model = require('../libs/drive-db/model');
// nombre de la tabla en db
const name = "cliente_operador";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "id_cliente",
        type: "INT NOT NULL"
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "id_operador",
        type: "INT NOT NULL"
    }, {
        name: "rol",
        type: "INT NOT NULL"
    }
]

var model = new Model(name, columns);

model.findAllOperadores = function (id, key_find = 'id_cliente') {
  var query = `SELECT * FROM operador o
    INNER JOIN cliente_operador co ON co.id_operador = o.id
    WHERE co.${key_find} = ${id}`
    return model.rawQuery(query);
}

model.findOneCliente = function (id, key_find = 'id_unidad') {
    var query = `SELECT * FROM cliente c
      INNER JOIN cliente_operador co ON co.id_cliente = c.id
      WHERE co.${key_find} = ${id} LIMIT 1`
      return model.rawQuery(query);
  }

model.deleteR = function (id_operador, id_cliente) {
    return model.deleteR({id_operador, id_cliente})
}

model.update = function (id_cliente, id_operador, obj) {
    var columnsUpdate = [
        'id_unidad',
        'rol'
    ];
    return model.update(obj, columnsUpdate, {id_cliente, id_operador});
}

module.exports = model;

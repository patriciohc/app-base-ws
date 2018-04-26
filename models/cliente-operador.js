'use strict'
/*
* operadores que tiene un cliente (administrador principal)
*
*/
var Model = require('../drive-db/model');
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

function sync () {
    return model.createTable();
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

function findAllOperadores (id, key_find = 'id_cliente') {
  var query = `SELECT * FROM operador o
    INNER JOIN cliente_operador co ON co.id_operador = o.id
    WHERE co.${key_find} = ${id}`
    return model.rawQuery(query);
}

function findOneCliente (id, key_find = 'id_unidad') {
    var query = `SELECT * FROM cliente c
      INNER JOIN cliente_operador co ON co.id_cliente = c.id
      WHERE co.${key_find} = ${id} LIMIT 1`
      return model.rawQuery(query);
  }

function findById (id) {
    return model.findById(id);
}

function insertBulk (columns, values) {
    return model.insertBulk (columns, values);
}

function deleteR (id_operador, id_cliente) {
    return model.deleteR({id_operador, id_operador})
}

function update (id_cliente, id_operador, obj) {
    var columnsUpdate = [
        'id_unidad',
        'rol'
    ];
    return model.update(obj, columnsUpdate, {id_cliente, id_operador});
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: model.addRelation,
    insertBulk,
    findAllOperadores,
    findOneCliente,
    deleteR,
    update
}

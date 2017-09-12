'use strict'
/*
* Pedido representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "pedido";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        // 0: en espera de aceptacion de la tienda
        // 1: aceptado por la tienda, preparando envio
        // 2: en ruta
        // 3: entregado
        name: "estatus",
        type: "TINYINT"
    }, {
        name: "comentarios",
        type: "VARCHAR(100)"
    }, {
        name: "fecha_pedido",
        type: "VARCHAR(100)"
    }, {
        name: "calificacion",
        type: "INT"
    }, {
        name: "id_direccion_solicitud",
        type: "INT"
    }, {
        name: "id_operador_entrega",
        type: "INT"
    }, {
        name: "id_unidad",
        type: "INT"
    }
]

var pedido = new Model(name, columns);

function sync () {
    return pedido.createTable();
}

function create (obj) {
    return pedido.create(obj);
}

function findOne (query) {
    return pedido.findOne(query);
}

function findAll (query) {
    return pedido.findAll(query);
}

function findById (id) {
    return pedido.findById(id);
}

function setEstatus(id, estatus) {
    var query = `UPDATE pedido
        SET estatus=${estatus}
        WHERE id=${id}`;
    return pedido.rawQuery(query);
}

function asignarRepartidor(id, idRepartidor) {
    var query = `UPDATE pedido
        SET id_operador_entrega=${idRepartidor}
        WHERE id=${id}`;
    return pedido.rawQuery(query);
}

function calificar(id, calificacion) {
    var query = `UPDATE pedido
        SET calificacion=${calificacion}
        WHERE id=${id}`;
    return pedido.rawQuery(query);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    setEstatus,
    asignarRepartidor,
    calificar,
    addRelation: pedido.addRelation,
}

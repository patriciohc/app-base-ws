'use strict'
var moment = require('moment');
var Model = require('../drive-db/model');
var types = require('../drive-db/data-types');

// const engine = require('../settings').DATA_BASE.engine;

// nombre de la tabla en db
const name = "unidad_calificaion";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "fecha",
        type: types.DATETIME
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "id_usuario",
        type: "INT"
    }, {
        name: "id_pedido",
        type: "INT"
    }, {
        name: "calificacion",
        type: "INT"
    }, {
        name: "comentario",
        type: "VARCHAR(200)"
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTable();
}

function create (obj) {
    var now = moment().utc();
    obj.fecha = now.format('YYYY-MM-DD');
    return model.create(obj)
}

function getCalificacion (id_unidad) {
    var query = `SELECT SUM(calificacion)/COUNT(*) as avg_calificacion, comentario as calificaion FROM unidad_calificaion
        WHERE id_unidad = ${id_unidad} ORDER BY fecha DESC`;
    return model.rawQuery(query);
}

module.exports = {
    sync,
    create,
    getCalificacion
}

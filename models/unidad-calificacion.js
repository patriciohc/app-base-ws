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
        name: "calificacion",
        type: "INT"
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTable();
}

function create (obj) {
    return model.create(obj)
}

function count (id_unidad) {
    var query = `SELECT COUNT(*) as total FROM unidad_calificaion
        WHERE id_unidad = ${id_unidad}`;
    return model.rawQuery(query);
}

function get (id_unidad) {
    var query = `SELECT SUM(calificacion)/COUNT(*) as calificaion FROM unidad_calificaion
        WHERE id_unidad = ${id_unidad}`;
    return model.rawQuery(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    update,
    deleteR
}

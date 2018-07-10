'use strict'
var moment = require('moment');
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');

// const engine = require('../settings').DATA_BASE.engine;

// nombre de la tabla en db
const name = "comentarios_productos";
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
        name: "id_producto",
        type: "INT"
    }, {
        name: "id_usuario",
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
    
}

function findOne (query) {
    return model.findOne(query);
}

function findAll (query) {
    return model.findAll(query);
}

function findById (id) {
    return model.findById(id);
}

function update (id, obj, keyUpdate = 'id') {
}

function deleteR (query) {
    return model.deleteR(query.where);
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

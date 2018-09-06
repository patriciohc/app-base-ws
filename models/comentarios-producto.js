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

module.exports = model

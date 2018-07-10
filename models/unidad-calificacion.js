'use strict'
var moment  = require('moment');
var Model   = require('../libs/drive-db/model');
var types   = require('../libs/drive-db/data-types');

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
    var query = `SELECT SUM(calificacion)/COUNT(*) as avg_calificacion, COUNT(*) as total FROM unidad_calificaion
        WHERE id_unidad = ${id_unidad}`;
    return model.rawQuery(query);
}

function getComentarios (id_unidad) {
    var query = `SELECT comentario FROM unidad_calificaion
    WHERE id_unidad = ${id_unidad} AND comentario != '' ORDER BY fecha DESC LIMIT 10`;
return model.rawQuery(query);  
}

module.exports = {
    sync,
    create,
    getCalificacion,
    getComentarios
}

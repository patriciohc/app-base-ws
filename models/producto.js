'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');

// nombre de la tabla en db
const name = "producto";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "codigo",
        type: "VARCHAR(100)"
    }, {
        name: "descripcion",
        type: "VARCHAR(100)"
    }, {
        name: "precio",
        type: types.REAL
    }, {
        name: "precio_publico",
        type: types.REAL
    }, {
        name: "imagen",
        type: "VARCHAR(100)"
    }, {
        name: "id_categoria",
        type: "INT NOT NULL"
    }, {
        name: "id_cliente",
        type: "INT NOT NULL"
    }
]

var model = new Model(name, columns);

model.update = function (id, id_cliente, obj) {
    var columnsUpdate = [
        'nombre',
        'descripcion',
        'codigo',
        'imagen',
        'precio',
        'precio_publico',
        'id_categoria',
    ];
    return this.coreUpdate(obj, columnsUpdate, {id, id_cliente})
}

model.findListByIds = function (ids) {
    var query = `SELECT * FROM producto
      WHERE id in [${ids}]`
      return producto.rawQuery(query);
}

module.exports =  model

'use strict'
/*
* Almacena ventas en sitio
*
*/
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');

// nombre de la tabla en db
const name = "venta_en_sitio";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "id_cliente",
        type: "INT"
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "no_tikect", // colonia, calle, numero
        type: "VARCHAR(200)"
    }, {
        name: "fecha", // latitud
        type: types.DATETIME
    }, {
        name: "subtotal", // longitud
        type: types.DECIMAL
    }, {
        name: "iva",
        type: types.DECIMAL
    }, {
        name: "descuento",
        type: "TIME"
    }, {
        name: "total",
        type: types.DECIMAL
    }
]

var model = new Model(name, columns);

model.update = function (obj, where) {
    var columnsUpdate = [
    ];
    return this.coreUpdate(obj, columnsUpdate, where);
}

module.exports = model;

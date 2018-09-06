'use strict'
/*
* Almacena productos de las ventas en sitio
*
*/
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');

// nombre de la tabla en db
const name = "productos_venta_sitio";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "id_venta_en_sitio",
        type: "INT"
    }, {
        name: "id_producto",
        type: "INT"
    }, {
        name: "cantidad", 
        type: "VARCHAR(200)"
    }, {
        name: "descuento",
        type: types.DATETIME
    }, {
        name: "total",
        type: types.DECIMAL
    }
]

var model = new Model(name, columns);

model.prototype.update = function (obj, where) {
    var columnsUpdate = [
    ];
    return this.coreUpdate(obj, columnsUpdate, where);
}

module.exports = model;

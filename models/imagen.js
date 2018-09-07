'use strict'
/*
* imagen
*
*/
var Model = require('../libs/drive-db/model');
// nombre de la tabla en db
const name = "image";
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
        name: "key",
        type: "VARCHAR(250)"
    }, {
        name: "url",
        type: "VARCHAR(250)"
    }, {
        name: "type_image",
        type: "VARCHAR(100)"
    }, {
        name: "label",
        type: "VARCHAR(100)"
    }, {
        name: "date",
        type: "DATE",
        default: "now()"
    }
]

var model = new Model(name, columns);

module.exports = model;

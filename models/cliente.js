'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var SHA256  = require("crypto-js/sha256");
var Model   = require('../libs/drive-db/model');
var types   = require('../libs/drive-db/data-types');

// nombre de la tabla en db
const name = "cliente";
// columnas de valor unico
const uniques = ['correo_electronico'];
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "razon_social",
        type: "VARCHAR(250)"
    }, {
        name: "representante_legal",
        type: "VARCHAR(100)"
    }, {
        name: "telefono",
        type: "varchar(100)"
    }, {
        name: "direccion", // dirreccion completa
        type: "varchar(200)"
    }, {
        name: "correo_electronico",
        type: "VARCHAR(100)"
    }, {
        name: "password",
        type: "VARCHAR(100)"
    }, {
        name: "id_device",
        type: "VARCHAR(100)"
    }, {
        name: "has_notification",
        type: types.SMALL_INT       
    }, {
        name: "has_chat",
        type: types.SMALL_INT
    }, {
        name: "correo_electronico_valido",
        type: types.SMALL_INT,
        default: 0
    }
]

var model = new Model(name, columns, uniques);


model.create = function (obj) {
  obj.password = SHA256(obj.password);
  return model.create(obj);
}

model.update = function (id, obj) {
    var columnsUpdate = [
        'razon_social',
        'representante_legal',
        'telefono',
        'direccion',
        'password',
        'id_device'
    ];
    return model.coreUpdate(obj, columnsUpdate, {id});
}

module.exports = model;

'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var SHA256 = require("crypto-js/sha256");
var Model = require('./model');
// nombre de la tabla en db
const name = "cliente";
// columnas de valor unico
const uniques = ['correo_electronico'];
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
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
    }
]

var cliente = new Model(name, columns, uniques);

function sync () {
    return cliente.createTable();
}

function create (obj) {
  obj.password = SHA256(obj.password);
  return cliente.create(obj);
}

function findOne (query) {
    return cliente.findOne(query);
}

function findAll (query) {
    return cliente.findAll(query);
}

function findById (id) {
    return cliente.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
}

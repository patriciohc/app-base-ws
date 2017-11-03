'use strict'
/*
* Usuario que usa la app de compra
*
*/
var SHA256 = require("crypto-js/sha256");
var Model = require('./model');
// nombre de la tabla en db
const name = "usuario";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "correo_electronico",
        type: "VARCHAR(250) NOT NULL"
    }, {
        name: "nombre",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "password",
        type: "varchar(100) NOT NULL"
    }, {
        name: "telefono", // telefono movil
        type: "varchar(200)"
    }, {
        name: "recibir_promociones",
        type: "TINYINT" // 1 true, 0 false
    },
]

var usuario = new Model(name, columns);

function sync () {
    return usuario.createTable();
}

function create (obj) {
  obj.password = SHA256(obj.password);
  return usuario.create(obj);
}

function findOne (query) {
    return usuario.findOne(query);
}

function findAll (query) {
    return usuario.findAll(query);
}

function findById (id) {
    return usuario.findById(id);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
}

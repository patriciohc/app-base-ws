'use strict'
/*
* Usuario que usa la app de compra
*
*/
var SHA256 = require("crypto-js/sha256");
var Model = require('../drive-db/model');
var types = require('../drive-db/data-types');

// nombre de la tabla en db
const name = "usuario";
// columnas de valor unico
const uniques = ['correo_electronico'];
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
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
        type: types.SMALL_INT // 1 true, 0 false
    }, {
        name: "id_push",
        type: "VARCHAR(100)"
    }, {
        name: "type_login",
        type: "VARCHAR(100)"  // facebook, google, 
    }, {
        name: "id_device",
        type: "VARCHAR(100)"
    }
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


function update(id, obj) {
    var columnsUpdate = [
        'nombre',
        'password',
        'telefono',
        'recibir_promociones',
        'id_device',
        'type_login'
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
    query += ` WHERE id = ${id}`;
    
    return usuario.rawQuery(query);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    update
}

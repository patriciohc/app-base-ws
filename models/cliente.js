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
    }, {
        name: "id_device",
        type: "VARCHAR(100)"
    }
]

var model = new Model(name, columns, uniques);

function sync () {
    return model.createTable();
}

function create (obj) {
  obj.password = SHA256(obj.password);
  return model.create(obj);
}

function findOne (query) {
    return model.findOne(query);
}

function findAll (query) {
    return model.findAll(query);
}

function findById (id) {
    return model.findById(id);
}

function update(id, obj) {
    var columnsUpdate = [
        'razon_social',
        'representante_legal',
        'telefono',
        'direccion',
        'password',
        'id_device'
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length - 1; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
    query += ` WHERE id = ${id}`;
    
    return model.rawQuery(query);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    update
}

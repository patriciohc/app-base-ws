'use strict'
/*
* OperadorEntrea representa un usuario repartidor
*
*/
var Model   = require('../libs/drive-db/model');
var types   = require('../libs/drive-db/data-types');
var SHA256  = require("crypto-js/sha256");


// nombre de la tabla en db
const name = "operador";
// columnas de valor unico
const uniques = ['correo_electronico'];
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "nombre",
        type: "VARCHAR(250) NOT NULL"
    }, {
        name: "apellido_paterno",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "apellido_materno",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "correo_electronico",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "password",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "foto",
        type: "VARCHAR(100)"
    }, {
        name: "estatus",
        type: types.SMALL_INT
    }, {
        name: "id_device",
        type: "VARCHAR(100)"
    }
]

var model = new Model(name, columns);

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
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'estatus',
        'foto',
        'id_device'
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length; i++) {
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
    addRelation: model.addRelation,
    update
}

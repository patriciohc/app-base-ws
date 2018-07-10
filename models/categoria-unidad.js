'use strict'
/*
* categoria_unidad, categoria a la que pertenece una unidad
*
*/
var Model = require('../libs/drive-db/model');
// nombre de la tabla en db
const name = "categoria_unidad";
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
        name: "descripcion",
        type: "VARCHAR(100)"
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTable();
}

function create (obj) {
    return model.create(obj);
}

function update (id, idCliente, obj) {
    var columnsUpdate = [
        'nombre',
        'descripcion'
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length - 1; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
    query += ` WHERE id = ${id} AND id_cliente = ${idCliente}`;
    
    return model.rawQuery(query);
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

function deleteR (query) {
  return model.deleteR(query.where)
}


module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    deleteR,
    update
}

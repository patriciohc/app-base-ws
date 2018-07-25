'use strict'
/*
* categoria al que petenece un producto, el cliente puede crear 
* y editar sus categorias.
*
*/
var Model = require('../libs/drive-db/model');
// nombre de la tabla en db
const name = "categoria";
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
    }, {
        name: "imagen",
        type: "VARCHAR(100)"
    }, {
        name: "id_cliente",
        type: "INT NOT NULL"
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
        'descripcion',
        'imagen',
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

function findAllByUnidad (id_unidad) {
    var query = `
    SELECT * FROM categoria c
    INNER JOIN unidad u ON u.id_cliente = c.id_cliente
    WHERE = u.id = ${id_unidad}
    `
    return model.rawQuery(query);
//   var sql = `
//   SELECT DISTINCT c.id, c.nombre, c.descripcion, c.imagen
//   FROM unidad_producto up
//   INNER JOIN producto p ON up.id_producto = p.id
//   INNER JOIN categoria c on p.id_categoria = c.id
//   WHERE up.id_unidad = ${id_unidad}`;
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: model.addRelation,
    findAllByUnidad,
    deleteR,
    update
}

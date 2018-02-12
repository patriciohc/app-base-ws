'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "categoria";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
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

var categoria = new Model(name, columns);

function sync () {
    return categoria.createTable();
}

function create (obj) {
    return categoria.create(obj);
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
    
    return categoria.rawQuery(query);
}

function findOne (query) {
    return categoria.findOne(query);
}

function findAll (query) {
    return categoria.findAll(query);
}

function findById (id) {
    return categoria.findById(id);
}

function deleteR (query) {
  return categoria.deleteR(query.where)
}

function findAllPorUnidad (id_unidad) {
  var sql = `
  SELECT DISTINCT c.id, c.nombre, c.descripcion, c.imagen
  FROM unidad_producto up
  INNER JOIN producto p ON up.id_producto = p.id
  INNER JOIN categoria c on p.id_categoria = c.id
  WHERE up.id_unidad = ${id_unidad}`;
  return categoria.rawQuery(sql)
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: categoria.addRelation,
    findAllPorUnidad,
    deleteR,
    update
}

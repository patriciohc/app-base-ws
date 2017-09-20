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

function findOne (query) {
    return categoria.findOne(query);
}

function findAll (query) {
    return categoria.findAll(query);
}

function findById (id) {
    return categoria.findById(id);
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
    findAllPorUnidad
}

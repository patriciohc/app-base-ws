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

model.update = function (id, id_cliente, obj) {
    var columnsUpdate = [
        'nombre',
        'descripcion',
        'imagen',
    ];
    return this.coreUpdate(obj, columnsUpdate, {id, id_cliente});
}

model.findAllByUnidad = function (id_unidad) {
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

module.exports = model

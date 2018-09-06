'use strict'
/*
* Cliente representa un usuario dueño de uno o varios establecimientos..
*
*/
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');

// nombre de la tabla en db
const name = "producto";
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
        name: "codigo",
        type: "VARCHAR(100)"
    }, {
        name: "descripcion",
        type: "VARCHAR(100)"
    }, {
        name: "precio",
        type: types.REAL
    }, {
        name: "precio_publico",
        type: types.REAL
    }, {
        name: "imagen",
        type: "VARCHAR(100)"
    }, {
        name: "id_categoria",
        type: "INT NOT NULL"
    }, {
        name: "id_cliente",
        type: "INT NOT NULL"
    }
]

var model = new Model(name, columns);

model.update = function (id, idCliente, obj) {
    var columnsUpdate = [
        'nombre',
        'descripcion',
        'codigo',
        'imagen',
        'precio',
        'precio_publico',
        'id_categoria',
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length - 1; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
    query += ` WHERE id = ${id} AND id_cliente = ${idCliente}`;
    
    return producto.rawQuery(query);
}

model.findListByIds = function (ids) {
    var query = `SELECT * FROM producto
      WHERE id in [${ids}]`
      return producto.rawQuery(query);
}

module.exports =  model

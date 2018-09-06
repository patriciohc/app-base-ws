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

model.update = function (id, idCliente, obj) {
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

module.exports = model

'use strict'
/*
* productos que tiene cada unidad
*
*/
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');
var utilsdb = require('../libs/drive-db/commons');
// nombre de la tabla en db
const name = "unidad_producto";
// columnas en db
const columns = [
    {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "id_producto",
        type: "INT"
    }, {
        name: "estatus",
        type: types.SMALL_INT
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTableLlaveCompuesta('id_unidad', 'id_producto');
}

function create (obj) {
    return model.create(obj);
}

async function addAll (id_unidad, id_cliente) {
    let sqlFaltantes = `select id
        from producto
        where id not in (select id_producto from unidad_producto where id_unidad = ${id_unidad})
        and id_cliente = ${id_cliente}`;
    let faltantes = await model.rawQuery(sqlFaltantes);
    let values = [];
    for (let i = 0;  i < faltantes.length; i++) {
        values.push([id_unidad, faltantes[i].id])
    }
    return await model.insertBulk (['id_unidad', 'id_producto'], values);
}

function update(id_unidad, id_producto, obj) {
    if (obj.estatus != undefined ) {
        let sql = `UPDATE ${name} SET estatus=${obj.estatus}
            WHERE id_unidad=${id_unidad} AND id_producto=${id_producto}`;

        return model.rawQuery(sql);
    }
}

function findOne (query) {
    return model.findOne(query);
}

function findAll (query) {
    return model.findAll(query);
}

function findAllNoInUnidad (id_cliente, id_unidad) {
    let sqlFaltantes = `select *
        from producto
        where id not in (select id_producto from unidad_producto where id_unidad = ${id_unidad})
        and id_cliente = ${id_cliente}`;
    return  model.rawQuery(sqlFaltantes);
}

function findAllProductos (id_unidad, search) {
    var query = `SELECT * FROM producto p
        INNER JOIN unidad_producto up ON up.id_producto = p.id
        WHERE up.id_unidad = ${id_unidad} `

    if (search.categoria) {
        query += `AND p.id_categoria = ${search.categoria} `
    }
    if (search.texto) {
        query += `AND (to_tsvector(p.descripcion) @@ to_tsquery('${search.texto}')
            OR to_tsvector(p.nombre) @@ to_tsquery('${search.texto}')
        )`
    }
    return model.rawQuery(query);
}

function findById (id) {
    return model.findById(id);
}

function insertBulk (columns, values) {
    return model.insertBulk (columns, values);
}

function deleteR (id_unidad, id_producto) {
    return model.deleteR({id_unidad, id_producto});
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    addRelation: model.addRelation,
    insertBulk,
    findAllProductos,
    update,
    addAll,
    findAllNoInUnidad,
    deleteR
}

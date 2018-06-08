'use strict'
/*
* Unidad representa un establecimiento, consultorio, local ect.
*
*/
var Model = require('../drive-db/model');
var types = require('../drive-db/data-types');

// nombre de la tabla en db
const name = "unidad";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "prefix",
        type: "VARCHAR(20)"
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "direccion", // colonia, calle, numerovarchar(100)
        type: "VARCHAR(200)"
    }, {
        name: "lat", // latitud
        type: types.DECIMAL
    }, {
        name: "lng", // longitud
        type: types.DECIMAL
    }, {
        name: "telefono",
        type: "VARCHAR(20)"
    }, {
        name: "hora_apetura",
        type: "TIME"
    }, {
        name: "hora_cierre",
        type: "TIME"
    }, {
        name: "estatus",
        type: types.SMALL_INT
    }, {
        name: "id_cliente", // dueño establecimiento
        type: "INT NOT NULL"
    }, {
        name: "imagen",
        type: "VARCHAR(250)"
    }, {
        name: "palabras_clave",
        type: "VARCHAR(250)"
    }, {
        name: "descripcion",
        type: "VARCHAR(250)"
    }, {
        name: "categoria",
        type: types.ARRAY,
        config: {
            arrayType: types.SMALL_INT
        }
    }
]

var unidad = new Model(name, columns);

function sync () {
    return unidad.createTable();
}

function create (obj) {
    return unidad.create(obj);
}

function update(idUnidad, idCliente, obj) {
    var columnsUpdate = [
        'nombre',
        'telefono',
        'hora_apetura',
        'hora_cierre',
        'imagen',
        'palabras_clave',
        'descripcion',
        'categoria'
    ];
    var updates = [];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length ; i++) {
        if (obj[columnsUpdate[i]])
            updates.push(`${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}'`);
    }
    query = query + updates.join(', ') // se quita coma
    query += ` WHERE id = ${idUnidad} AND id_cliente = ${idCliente}`;
    
    return unidad.rawQuery(query);
}

function addPosition(idUnidad, idCliente, obj) {
    var query = `UPDATE ${name} 
    SET lat = ${obj.lat}, lng = ${obj.lng} 
    WHERE id = ${idUnidad} AND id_cliente = ${idCliente}`;
    return unidad.rawQuery(query);
}

// function findOne (query) {
//     var unidad;
//     unidad.findOne(query)
//     .then(function (result) {
//         unidad = result;
//         return Poligono.findOne(result.id);
//     })
//     .then(function (result) {

//     })
//     .catch(function () {

//     });
// }

/**
* Regresa todas las unidades que se encuentran a una determinada distancia de lat, lng
* y cumplen con un prametro de busqueda
* @param {float} lat - latitud obligatorio
* @param {float} lng - longitud obligatorio
* @return {array} array de tipo Unidad
*/
function find (lat, lng, distancia, extraQuery) {
    var latmin = parseFloat(lat) - parseFloat(distancia);
    var latmax = parseFloat(lat) + parseFloat(distancia);
    var lngmin = parseFloat(lng) - parseFloat(distancia);
    var lngmax = parseFloat(lng) + parseFloat(distancia);
    var query = `SELECT * FROM ${name} WHERE
        lat BETWEEN ${latmin} AND ${latmax} AND
        lng BETWEEN ${lngmin} AND ${lngmax}
    `;
    if (extraQuery.categoria) {
        query +=    `AND ${extraQuery.categoria} = ANY (categoria) `
    }
    if (extraQuery.texto) {
        query += `AND (to_tsvector(descripcion) @@ to_tsquery(${extraQuery.texto})
            OR to_tsvector(nombre) @@ to_tsquery(${extraQuery.texto})
        )`
    } 
    return unidad.rawQuery(query)
}

function findAll (query) {
    return unidad.findAll(query);
}

function findById (id) {
    return unidad.findById(id);
}

function deleteR (id, id_cliente) {
    return unidad.deleteR({id, id_cliente});
}

module.exports = {
    sync,
    create,
    deleteR,
    findById,
    findAll,
    find,
    addRelation: unidad.addRelation,
    addPosition,
    update
}

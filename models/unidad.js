'use strict'
/*
* Unidad representa un establecimiento, consultorio, local ect.
*
*/
var Model = require('./model');
// nombre de la tabla en db
const name = "unidad";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "nombre",
        type: "VARCHAR(250)"
    }, {
        name: "direccion", // colonia, calle, numerovarchar(100)
        type: "VARCHAR(200)"
    }, {
        name: "lat", // latitud
        type: "DOUBLE"
    }, {
        name: "lng", // longitud
        type: "DOUBLE"
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
        type: "TINYINT"
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
        name: "id_push",
        type: "VARCHAR(100)"
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
        'descripcion'
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length - 1; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
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
* @param {float} lat - latitud
* @param {float} lng - longitud
* @return {array} array de tipo Unidad
*/
function findPorDistancia (lat, lng, distancia) {
    var latmin = parseFloat(lat) - parseFloat(distancia);
    var latmax = parseFloat(lat) + parseFloat(distancia);
    var lngmin = parseFloat(lng) - parseFloat(distancia);
    var lngmax = parseFloat(lng) + parseFloat(distancia);
    var query = `SELECT * FROM ${name} WHERE
        lat BETWEEN ${latmin} AND ${latmax} AND
        lng BETWEEN ${lngmin} AND ${lngmax}
    `;
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
    findPorDistancia,
    addRelation: unidad.addRelation,
    addPosition,
    update
}

'use strict'
/*
* Poligono que conrresponde a un establecimiento
*
*/
const fs = require('fs');
const tj = require('togeojson');
const DOMParser = require('xmldom').DOMParser;
const inside = require('point-in-polygon');

const DIR_KML = "./kml/"

var Model = require('./model');
// nombre de la tabla en db
const name = "poligono";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "lat",
        type: "DOUBLE"
    }, {
        name: "lng",
        type: "DOUBLE"
    }
]

var poligono = new Model(name, columns);

function sync () {
    return poligono.createTable();
}

/**
 * guarda nuevo poligono
 * @param {string} idUnidad id de la unidad al que pertenece el poligono
 * @param {string} kml nombre de kml del poligono
 * @returns {Promise}
 */
function create (idUnidad, kml) {
    var stringxml = fs.readFileSync(DIR_KML + kml, 'utf8');
    var kml = new DOMParser().parseFromString(stringxml);
    var converted = tj.kml(kml);
    if (!converted.features || !converted.features.length || converted.features.length == 0) {
        return;
    }
    var tmp = converted.features[0];
    if (!tmp.geometry || !tmp.geometry.coordinates) {
        return;
    }
    var cordenadas = tmp.geometry.coordinates[0];
    var values = [];
    for (let i = 0; i < cordenadas.length; i++) {
        var cordenada = cordenadas[i];
        values.push([
            idUnidad,
            cordenada[0],
            cordenada[1]
        ]);
    }
    return poligono.insertBulk('id_unidad, lat, lng', values);
}

/**
 * verficia si lat, lng estan dentro del poligono de la unidad
 * @param {float} lat - latitud
 * @param {float} lng - longitud
 * @param {Unidad} unidad - unidad a verificar
 * @param {array} isInsadeUnidades - array donde se metera la unidad si pasa
 * @returns {Promise} unidad
 */
function isInsade (lat, lng, unidad, isInsadeUnidades) {
    return new Promise (function (resolve, reejct) {
        poligono.findAll({where:{id_unidad: unidad.id}})
        .then(function (results) {
            var  polygon = [];
            for (var i = 0; i < results.length; i++) {
                polygon.push([
                    results[i].lat,
                    results[i].lng
                ]);
            }
            console.log(inside([ lat, lng ], polygon));
            if (inside([ lat, lng ], polygon)) {
                isInsadeUnidades.push(unidad);
            }
            resolve();
        })
    });
}

function deleteU (idUnidad) {
    return unidad.delte({id_unidad: idUnidad});
}

module.exports = {
    sync,
    create,
    isInsade,
    deleteU
}

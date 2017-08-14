'use strict'
/*
* Poligono que conrresponde a un establecimiento
*
*/
const fs = require('fs');
const tj = require('togeojson');
const DOMParser = require('xmldom').DOMParser;

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
 * guardaa nuevo poligono
 * @param {string} idUnidad id de la unidad al que pertenece el poligono
 * @param {Position[]} puntos array de posiciones lat, lng
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
    console.log(cordenadas);
    var values = [];
    for (let i = 0; i < cordenadas.length; i ++) {
        var cordenada = cordenadas[i];
        values.push([
            idUnidad,
            cordenada[0],
            cordenada[1]
        ]);
    }
    return poligono.insertBulk(values, 'id_unidad, lat, lng');
}

function findOne (idUnidad) {
    return unidad.findOne(query);
}

function deleteU (idUnidad) {
    return unidad.delte({id_unidad: idUnidad});
}

module.exports = {
    sync,
    create,
    findOne,
    deleteU
}

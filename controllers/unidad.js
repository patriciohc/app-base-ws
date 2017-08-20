'use strict'

const unidad = require('../models').unidad;
const poligono = require('../models').poligono;
const inside = require('point-in-polygon');

function get(req, res) {
    unidad.findById(req.params.id)
    .then(function(result) {
        if (!result) {
            return res.status(404).send({err: "not found"});
        } else {
            return res.status(200).send(result);
        }
    })
    .catch(function(err) {
        return res.status(500).send({err});
    });
}

/**
* localiza las unidades que se encutran dentro del rango de entrega
* de la latitud y longitud recivida
* @param {float} lat - latitud
* @param {float} lng - longitud
* @return {array} array de uidaddes
*/
function localizarUnidades (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    unidad.localizarUnidades(lat, lng)
    .then(function (result) {
        // var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
        //
        // console.dir([
        //     inside([ 1.5, 1.5 ], polygon),
        //     inside([ 4.9, 1.2 ], polygon),
        //     inside([ 1.8, 1.1 ], polygon)
        // ]);
    })
    .catch(function (err) {

    });
}

function getLista(req, res) {
    unidad.findAll()
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    var u = req.body, idUnidad;
    if (req.file) {
        u.file_kml = req.file.filename;
    }

    unidad.create(u)
    .then(function(result) {
        idUnidad = result.insertId;
        if (req.file) {
            return poligono.create(result.insertId, u.file_kml);
        }
    })
    .then(function(result) {
        return res.status(200).send({id: idUnidad});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })

}

function update(req, res) {

}

module.exports = {
    get,
    getLista,
    create,
    update,
}

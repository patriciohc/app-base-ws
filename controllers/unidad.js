'use strict'

const unidad = require('../models').unidad;
const poligono = require('../models').poligono;

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
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    var distancia = 0.25;
    unidad.findPorDistancia(lat, lng, distancia)
    .then(function (result) {
        var unidadesDisponibles = [];
        var arrayPromises = [];
        for (var i = 0; i < result.length; i++) {
            arrayPromises.push(poligono.isInsade(lat, lng, result[i], unidadesDisponibles));
        }
        Promise.all(arrayPromises)
        .then(function () {
            return res.status(200).send(unidadesDisponibles);
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).send(err);
        });
    })
    .catch(function (err) {
        console.log(err);
        return res.status(500).send(err);
    });
}

function localizarUnidadesPoligonos(req,  res, promises) {

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
    localizarUnidades,
    create,
    update,
}

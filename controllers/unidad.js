'use strict'

const unidad = require('../models').unidad;
const poligono = require('../models').poligono;
const unidadProducto = require('../models').unidadProducto;
const utils = require('./utils');

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

function getListaCliente(req, res) {
    unidad.findAll({where: {id_cliente: req.query.id_cliente}})
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
        } else {
            return new Promise(resolve => resolve());
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

function deleteR(req, res) {
  unidad.deleteR(req.query.id)
  .then(result => {
    res.status(200).send(result);
  })
  .catch(err => {
    console.log(err);
  })
}

function addProducto(req, res) {
  console.log(req.body);
    // var params = ["id_unidad", "ids_producto"];
    // if (!utils.andValidate(params, req.body)) {
    //     return res.status(400).send({err: "se require id_unidad, ids_producto"});
    // }
    // var up = utils.minimizarObjeto(params, req.body);

    unidadProducto.insertBulk(req.body)
    .then(result => {
        return res.status(200).send({success: true});
    })
    .catch(err => {
        return res.status(500).send({err: err});
    });
}

module.exports = {
    get,
    localizarUnidades,
    create,
    update,
    getLista,
    addProducto,
    deleteR
}

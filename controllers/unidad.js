'use strict'

const unidad = require('../models').unidad;

function getUnidad(req, res) {
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

function getListaUnidad(req, res) {
    unidad.findAll()
    .then(function(result){
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function createUnidad(req, res) {
    console.log(req.body);
    unidad.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })

}

function updateCliente(req, res) {

}

module.exports = {
    getUnidad,
    getListaUnidad,
    createUnidad,
    updateCliente,
}

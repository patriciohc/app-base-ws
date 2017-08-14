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

function getLista(req, res) {
    unidad.findAll()
    .then(function(result){
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    console.log(req.file);
    console.log(req.body);
    var u = req.body;
    if (req.file) {
        u.file_kml = req.file.filename;
    }

    unidad.create(u)
    .then(function(result) {
        if (req.file) {
            return poligono.create(result.insertId, u.file_kml);
        }
    })
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
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

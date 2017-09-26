'use strict'
const utils = require('./utils');
const producto = require('../models').producto;

function get(req, res) {
    producto.findById(req.params.id)
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
    if (!req.query.id_unidad && !req.query.id_cliente && !req.query.id_categoria) {
        return res.status(400).send({err: "se requiere: id_unidad || id_cliente || id_categoria"});
    }
    var where = utils.minimizarObjeto(["id_unidad", "id_cliente", "id_categoria"], req.query);
    producto.findAll({where})
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    producto.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function update(req, res) {

}

function deleteR(req, res) {
  if (!req.query.id)
    return res.status(400).send({err: "se requiere id de producto"})
  producto.deleteR({where: {id: req.query.id}})
}

module.exports = {
    get,
    create,
    update,
    getLista,
    deleteR
}

'use strict'

const categoria = require('../models').categoria;
const utils = require('./utils');

function get(req, res) {
    categoria.findById(req.params.id)
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
    if (!req.query.id_cliente) {
        return res.status(400).send({err: "se requiere id_cliente"});
    }
    var where = utils.minimizarObjeto(["id_cliente"], req.query);
    categoria.findAll({where})
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function getListaPorUnidad(req, res) {
  if (!req.query.id_unidad) {
      return res.status(400).send({err: "se requiere id_unidad"});
  }
  categoria.findAllPorUnidad(req.query.id_unidad)
  .then(function(result) {
      return res.status(200).send(result);
  })
  .catch(function(err){
      return res.status(500).send({err: err});
  })
}

function create(req, res) {
    categoria.create(req.body)
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
    create,
    update,
    getLista,
    getListaPorUnidad,
}

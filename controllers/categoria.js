'use strict'

const categoria = require('../models').categoria;
const utils = require('./utils');

function get(req, res) {
    categoria.findById(req.params.id)
    .then(function(result) {
        if (!result) {
            return res.status(404).send({code:"ERROR", message: "not found"});
        } else {
            return res.status(200).send({code:"SUCCESS", message:"", data: result});
        }
    })
    .catch(function(err) {
        return res.status(500).send({code:"ERROR",  message:"", data: err});
    });
}

async function getLista(req, res) {
    var id_unidad = req.query.id_unidad;
    var id_cliente = req.query.id_cliente;
    try {
        if (id_unidad) {
            var response = await categoria.findAllByUnidad(id_unidad);
            return res.status(200).send({code: "SUCCESS", message: "", data: response});
        } else if (id_cliente) {
            var query = {where: {id_cliente}}
            var response = await categoria.findAll(query);
            return res.status(200).send({code: "SUCCESS", message: "", data: response});
        } else {
            return res.status(404).send({code: "ERROR", message: "se requiere id_unidad o id_cliente"});
        }
    } catch (err) {
        return res.status(500).send({code:"ERROR", message: "", data: err});
    }
}

function create(req, res) {
    var obj = req.body;
    obj.id_cliente = req.usuario;
    categoria.create(obj)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function update(req, res) {
    var obj = req.body
    var id = req.query.id_categoria
    var idCliente = req.usuario;
    categoria.update(id, idCliente, obj)
    .then(function(result) {
        return res.status(200).send({code: 'OK', message:"success", affected: result.affectedRows});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function deleteR(req, res) {
  if (!req.query.id)
    return res.status(400).send({err: "se requiere id del registro"})
  categoria.deleteR({id: req.query.id})
  .then(result => {
    return res.status(200).send({success: true})
  })
  .catch(err => {
    return res.status(500).send({err})
  });
}

module.exports = {
    get,
    create,
    update,
    getLista,
    // getListaPorUnidad,
    deleteR
}

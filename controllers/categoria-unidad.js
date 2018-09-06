'use strict'

const CategoriaUnidad = require('../models').categoriaUnidad;
const utils = require('./utils');

// function get(req, res) {
//     categoria.findById(req.params.id)
//     .then(function(result) {
//         if (!result) {
//             return res.status(404).send({err: "not found"});
//         } else {
//             return res.status(200).send(result);
//         }
//     })
//     .catch(function(err) {
//         return res.status(500).send({err});
//     });
// }

function getList(req, res) {
    CategoriaUnidad.findAll()
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err) {
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    var obj = req.body;
    CategoriaUnidad.create(obj)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

// function update(req, res) {
//     var obj = req.body
//     var id = req.query.id_categoria
//     var idCliente = req.usuario;
//     categoria.update(id, idCliente, obj)
//     .then(function(result) {
//         return res.status(200).send({code: 'OK', message:"success", affected: result.affectedRows});
//     })
//     .catch(function(err) {
//         return res.status(500).send({err: err})
//     })
// }

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
    //get,
    create,
    //update,
    getList,
    deleteR
}

'use strict'
const utils = require('./utils');
const producto = require('../models').producto;

function get(req, res) {
    if (!req.query.id_producto) return res.status(404).send({code:"ERROR", message:"falta el id de producto"})
    var id_usuario = req.usuario;
    var select;
    if (!id_usuario) {
        select = ['id', 'nombre', 'codigo', 'descripcion', 'precio_publico', 'imagen', 'id_categoria'];
    } /* else determinar que tipo de rol tiene para enviar mas info*/
    producto.findById(req.query.id_producto, select)
    .then(function(result) {
        if (!result) {
            return res.status(404).send({code:"ERROR", message: "not found"});
        } else {
            return res.status(200).send({code:"SUCCESS", message: "", data: result});
        }
    })
    .catch(function(err) {
        return res.status(500).send({err});
    });
}

function getLista(req, res) {
    if (!req.query.id_cliente && !req.query.id_categoria) {
        return res.status(400).send({err: "se requiere: id_cliente o id_categoria"});
    }
    var where = utils.minimizarObjeto(["id_cliente", "id_categoria"], req.query);
    producto.findAll({where})
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function getDetalle(req, res) {
    var id_cliente = req.usuario;
    var id = req.query.id_producto;
    if (!id_cliente || !id) {
        return res.status(400).send({err: "se requiere: id_cliente || id"});
    }
    var where = {id_cliente, id}
    producto.findAll({where})
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function getListaCliente(req, res) {
    var usuario = req.usuario;
    producto.findAll({where: {id_cliente: usuario}})
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    var obj = req.body;
    obj.id_cliente = req.usuario;
    producto.create(obj)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function update(req, res) {
    var obj = req.body
    var idProducto = req.query.id_producto
    var idCliente = req.usuario;
    producto.update(idProducto, idCliente, obj)
    .then(function(result) {
        return res.status(200).send({code: 'OK', message:"success", affected: result.affectedRows});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function deleteR(req, res) {
  if (!req.query.id_producto)
    return res.status(400).send({err: "se requiere id del registro"})
  producto.deleteR({where: {id: req.query.id_producto}})
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
    deleteR,
    getListaCliente,
    getDetalle
}

'use strict'
const utils = require('./utils');
const producto = require('../models').producto;
const UnidadProducto = require('../models').unidadProducto;

function get(req, res) {
    if (!req.params.id_producto) return res.status(404).send({code:"ERROR", message:"falta el id de producto"})
    var id_usuario = req.usuario;
    var select;
    if (!id_usuario) {
        select = ['id', 'nombre', 'codigo', 'descripcion', 'precio_publico', 'imagen', 'id_categoria'];
    } /* else determinar que tipo de rol tiene para enviar mas info*/
    producto.findById(req.params.id_producto, select)
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

async function getListaCliente(req, res) {
    const { not_id_unidad } = req.query;
    var where = {id_cliente: req.usuario}
    var result;
    try {
        if (not_id_unidad) {
            where.id_unidad = {value: not_id_unidad, op: 'neq'};
            result = await UnidadProducto.findAllNoInUnidad(where.id_cliente, not_id_unidad);
            return res.status(200).send({code:'SUCCESS', message: '', data: result});
        } else {
            result = await producto.findAll({where});
            return res.status(200).send({code:'SUCCESS', message: '', data: result});
        }
    } catch (err) {
        return res.status(500).send({code:'ERROR', message: '', data: result});
    }
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
  producto.deleteR({id: req.query.id_producto})
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

'use strict'

const pedido = require('../models').pedido;

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
//
// function getLista(req, res) {
//     categoria.findAll({where: {id_unidad: req.query.id_unidad}})
//     .then(function(result) {
//         return res.status(200).send(result);
//     })
//     .catch(function(err){
//         return res.status(500).send({err: err});
//     })
// }

function create(req, res) {
    console.log(req.body);
    pedido.create(req.body)
    .then(function(id) {
        return res.status(200).send({id: id});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function setEstatus(req, res) {
    pedido.setEstatus(req.body.id_pedido, req.body.estatus)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function asignarRepartidor(req, res) {
    pedido.asignarRepartidor(req.body.id_pedido, req.body.idRepartidor)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function calificar(req, res) {
    pedido.calificar(req.body.id_pedido, req.body.calificacion)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function getPedidoPorRepartidor(req, res) {
    pedido.findAll({
        where: {
            id_operador_entrega: req.query.id_repartidor,
            estatu: 2
        }})
    .then( result => {
        return res.status(200).send({pedidos: result});
    })
    .catch( err => {
        return res.status(500).send({err: err});
    });
}

module.exports = {
    //get,
    create,
    //update,
    //getLista,
    setEstatus,
    asignarRepartidor,
    calificar,
    getPedidoPorRepartidor,
}

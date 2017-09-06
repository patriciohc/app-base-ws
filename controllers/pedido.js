'use strict'
const DireccionSolicitud = require('../models').direccionSolicitud;
const ListaPedido = require('../models').listaPedido;
const Pedido = require('../models').pedido;

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

    var idPedido;
    DireccionSolicitud.create(req.body.direccion_entrega)
    .then( result => {
        console.log(result);
        var pedido = {
            estatus: 0, // en espera de aceptacion por parte de la la unidad
            comentarios: req.body.comentarios,
            fecha_pedido: (new Date()).toString(),
            calificacion: 0, // no ha recibido calificacion
            id_direccion_solicitud: result.insertId,
            //id_operador_entrega: // no se ha asignado repartidor
        }
        return Pedido.create(pedido);
    })
    .then( result => {
        var values = [];
        idPedido = result.insertId;
        for (let i = 0; i < req.body.pedido.length; i++){
            values.push([idPedido, req.body.pedido[i].id_producto, req.body.pedido[i].cantidad]);
        }
        return ListaPedido.insertBulk("id_pedido, id_producto, cantidad", values);
    })
    .then( result => {
        return res.status(200).send({id_pedido: idPedido})
    })
    .catch( err => {
        console.log(err);
        return res.status(200).send({err: err});
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

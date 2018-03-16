'use strict'
const DireccionSolicitud = require('../models').direccionSolicitud;
const ListaPedido = require('../models').listaPedido;
const Pedido = require('../models').pedido;
const utils = require('./utils');
const notification = require('./push-notification');

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

function getListaPorUnidad(req, res) { // forbidden for users
    var id_cliente = req.usuario;
    var params = ["id_unidad", "id_cliente"];
    // if (!utils.orValidate(params, req.query)) {
    //     return res.status(400).send({err: "se requiere: id_unidad || id_cliente"});
    // }
    // var where = utils.minimizarObjeto({id_cliente, id_unidad: req.query.id_unidad}, req.query);
    var where = {id_cliente, id_unidad: req.query.id_unidad};
    Pedido.findAllWithDependencies({where})
    .then(function(result) {
      console.log(result);
      return res.status(200).send(result);
    })
    .catch(function(err){
      console.log(err);
      return res.status(500).send({err});
    })
}

function getListaPorUsuario(req, res) {
//   var params = ["id_usuario"];
    if (!req.usuario) {
      return res.status(400).send({err: "se requiere: id_usuario"});
    }
    //var where = utils.minimizarObjeto(params, req.query);
    Pedido.findAllWithDependencies({where: {id_usuario: req.usuario}})
    .then(function(result) {
      console.log(result);
      return res.status(200).send(result);
    })
    .catch(function(err){
      console.log(err);
      return res.status(500).send({err});
    })
}

// pedido pago en efectivo
async function create(req, res) {
    console.log(req.body);
    var pedido = await createPedido(req.body);
    if (pedido.id) {
        notification.sendPushUnidad(pedido.id_unidad)
        return res.status(200).send({id_pedido: pedido.id})
    } else {
        return res.status(500).send({code: 'ERROR', message: 'error', error: pedido})
    }
}

async function createPedido(pedido) {
    var date = new Date();
    var response;
    try {
        var response = await DireccionSolicitud.create(pedido.direccion_entrega);
        var pedidoJson = {
            estatus: 1, // en espera de aceptacion por parte de la la unidad
            comentarios: pedido.comentarios,
            fecha_recibido: utils.getDateMysql(date),
            hora_recibido: utils.getTimeMysql(date),
            calificacion: 0, // no ha recibido calificacion
            id_direccion_solicitud: response.insertId,
            id_unidad: pedido.id_unidad,
            id_usuario: pedido.id_usuario,
            //id_operador_entrega: // no se ha asignado repartidor
        }
        response = await Pedido.create(pedidoJson);
        pedidoJson.id = response.insertId;
        var values = [];
        for (let i = 0; i < pedido.pedido.length; i++) {
            values.push([pedidoJson.id, pedido.pedido[i].id_producto, pedido.pedido[i].cantidad]);
        }
        response = ListaPedido.insertBulk("id_pedido, id_producto, cantidad", values);
        if (response) {
            return pedidoJson;
        }
    } catch (err) {
        return err;
    }
}

function setEstatus(req, res) {
    var status = req.body.estatus;
    var idUser = req.body.id_usuario;
    switch (status) {
        case 2:
            notification.sendPushOneUser(
                'Su pedido ha sido recibido', 
                'Gracias por su compra, su pedido se esta preparando', 
                idUser)
            break;
        case 3:
            notification.sendPushOneUser(
                'Su pedido esta en camino', 
                'Gracias por esperar, su pedido ha sido enviado', 
                idUser)
        break;
        case 4:
            notification.sendPushOneUser(
                'Su pedido ha sido entregado', 
                'Gracias por su compra, ayudanos a mejorar calificando el servicio', 
                idUser)
        break;
    }
    Pedido.setEstatus(req.query.id, status)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function asignarRepartidor(req, res) {
    Pedido.asignarRepartidor(req.query.id, req.body.id_repartidor)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function calificar(req, res) {
    Pedido.calificar(req.body.id_pedido, req.body.calificacion)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function getListaPorRepartidor(req, res) {
  if (!req.query.id_repartidor) return res.status(404).send({message: "se require id_repartidor"})
    Pedido.findAllWithDependencies({
        where: {
            id_operador_entrega: req.query.id_repartidor,
            estatus: 3
        }})
    .then( result => {
        return res.status(200).send(result);
    })
    .catch( err => {
        return res.status(500).send({err: err});
    });
}

module.exports = {
    //get,
    create,
    //update,
    getListaPorUnidad,
    getListaPorUsuario,
    setEstatus,
    asignarRepartidor,
    calificar,
    getListaPorRepartidor,
    createPedido
}

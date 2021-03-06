'use strict'
const DireccionSolicitud = require('../models').direccionSolicitud;
const ListaPedido = require('../models').listaPedido;
const Pedido = require('../models').pedido;
const Usuario = require('../models').usuario;
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
    // if (!utils.orValidate(params, req.query)) {
    //     return res.status(400).send({err: "se requiere: id_unidad || id_cliente"});
    // }
    // var where = utils.minimizarObjeto({id_cliente, id_unidad: req.query.id_unidad}, req.query);
    if (!req.query.id_unidad) return res.status(404).send({code:"ERROR", message:"Falta id de unidad"});
    var where = {
        id_cliente, 
        id_unidad: req.query.id_unidad,
        _raw: "pedido.estatus != 0 AND pedido.estatus != 4"
    };
    Pedido.findAllWithDependencies({where, order_by: {value: 'fecha_recibido', order: 'DESC'}})
    .then(function(result) {
      console.log(result);
      return res.status(200).send({code: "SUCCESS", message:"", data: result});
    })
    .catch(function(err){
      console.log(err);
      return res.status(500).send({code: "ERROR", message:"", data: err});
    })
}

function getListaPorUsuario(req, res) {
//   var params = ["id_usuario"];
    if (!req.usuario) {
      return res.status(400).send({err: "se requiere: id_usuario"});
    }
    var where = {
        id_usuario: req.usuario,
        _raw: "pedido.estatus != 0 AND pedido.estatus != 4"
    }
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

// pedido pago en efectivo
async function create(req, res) {
    var jsonPedido = req.body;
    jsonPedido.id_usuario = req.usuario;
    var pedido = await createPedido(jsonPedido);
    if (pedido.id) {
        notification.sendPushUnidad(pedido.id_unidad)
        return res.status(200).send({id_pedido: pedido.id})
    } else {
        return res.status(500).send({code: 'ERROR', message: 'error', error: pedido})
    }
}

function deleteR(req, res) {
    var id_usuario = req.usuario;
    var id = req.query.id;
    if (!id) {
        return res.status(400).send({err: "se requiere id de pedido"})
    }
    Pedido.deleteR({where: {id, id_usuario}})
    .then(result => {
      return res.status(200).send({code:'OK', message:"success", affected_rows: result.affectedRows})
    })
    .catch(err => {
      return res.status(500).send({code:'ERROR', message:"", error: err})
    });
  }

async function createPedido(pedido, estatus = 1) {
    var response;
    try {
        var response = await DireccionSolicitud.create(pedido.direccion_entrega);
        var pedidoJson = {
            estatus: estatus, // en espera de aceptacion por parte de la la unidad
            comentarios: pedido.comentarios,
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
        response = await ListaPedido.insertBulk("id_pedido, id_producto, cantidad", values);
        
        if (response) {
            return pedidoJson;
        }
    } catch (err) {
        return err;
    }
}

async function setEstatus(req, res) {
    var status = req.body.estatus;
    var idPedido = req.query.id;
    if (!status || !idPedido) return res.status.statu(400).send({code:"ERROR", message: "Faltan parametros"})
    // var idUser = req.body.id_usuario;
    var pedido = await Pedido.findById(idPedido);
    var user = await Usuario.findById(pedido.id_usuario);
    switch (status) {
        case 2:
            notification.sendPushOneUserApp(
                'Su pedido ha sido recibido', 
                'Gracias por su compra, su pedido se esta preparando', 
                [user.id_device],
                {type: 'seguimiento', id_pidido: idPedido})
            break;
        case 3:
            notification.sendPushOneUserApp(
                'Su pedido esta en camino', 
                'Gracias por esperar, su pedido ha sido enviado', 
                [user.id_device],
                {type: 'seguimiento', id_pidido: idPedido})
        break;
        case 4:
            notification.sendPushOneUserApp(
                'Su pedido ha sido entregado', 
                'Gracias por su compra, ayudanos a mejorar calificando el servicio', 
                [user.id_device],
                {type: 'seguimiento', id_pidido: idPedido})
        break;
    }
    Pedido.setEstatus(idPedido, status)
    .then( result => {
        return res.status(200).send({success: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function asignarRepartidor(req, res) {
    Pedido.asignarRepartidor(req.query.id_pedido, req.body.id_repartidor)
    .then( result => {
        return res.status(200).send({code: "OK", message: "success", response: result});
    })
    .catch( err => {
        console.log(err);
        return res.status(500).send({err: err});
    })
}

function getListaPorRepartidor(req, res) {
    var id_usiario = req.usuario;
    Pedido.findAllWithDependencies({
        where: {
            id_operador_entrega: id_usiario,
            estatus: 3
        }})
    .then( result => {
        return res.status(200).send(result);
    })
    .catch( err => {
        return res.status(500).send({err: err});
    });
}

function getNPedidosXWeek(req, res) {
    var date = req.query.date || new Date()
    try {
        //var response = Pedido.getNPedidosXWeek(date);
        return res.status(200).send({code: 'OK', message: 'metodo en construccion'});
    } catch (err) {
        return res.status(500).send({code: 'ERROR', message:''})
    }
}

function calificar(req, res) {
    var id_pedido = req.body.id_pedido
    try {
        var response = Pedido.calificar(id_pedido);
        return res.status(200).send({code: 'OK', message: 'metodo en construccion'});
    } catch (err) {
        return res.status(500).send({code: 'ERROR', message:''})
    }
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
    createPedido,
    getNPedidosXWeek,
    deleteR
}

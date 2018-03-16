
const http = require('http');
const permisos = require('../permisos');
const cliente = require('../models').cliente;
const operador = require('../models').operador;
const usuario = require('../models').usuario;
const clienteOperador = require('../models').clienteOperador;

async function suscribe (req, res) {
    var id_usuario = req.usuario;
    var rol = req.rol;
    var id_device = req.body.id_device;
    var response;
    try {
        if (rol == permisos.CLIENTE) {
            response = cliente.update(id_usuario, {id_device})
        } else if (rol == permisos.USUSARIO) {
            response = usuario.update(id_usuario, {id_device})
        } else {
            response = operador.update(id_usuario, {id_device})
        }
    } catch(err) {
        return res.status(500).send({code: "ERROR", message: "", error: err})
    }

    if (response) {
        return res.status(200).send({code: "SUCCESS", message: ""})
    } else {
        return res.status(500).send({code: "ERROR", message: ""})
    }
}

async function sendPushUnidad(id_unidad) {
    var idsDevices = [];
    var operadores = await clienteOperador.findAllOperadores(id_unidad, 'id_unidad');
    var cliente = await cliente.clienteOperador(id_unidad, 'id_unidad')
    for (var i = 0; i < operadores.length; i++) {
        idsDevices.push(operadores.id_device)
    }
    idsDevices.push(cliente.id_device)
    sendPush('Nuevo pedido!!!', 'Ha recibido un nuevo pedido', idsDevices)
}

async function sendPush(title, message, idDevices) {

    var data = {
        app_id: "",
        // included_segments: [segment],
        include_player_ids: idDevices,
        data: {},
        headings: {en: title},
        // ios_badgeType: 'SetTo',
        // ios_badgeCount: 0,
        // subtitle: {en: subtitle},
        contents: {en: message}
    };
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YjMyMjMzMGMtMGUxZC00NmQwLWFhOTMtYzAwMzhmODVhOTM0"
      };
      
      var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };
      
      var req = https.request(options, function(res) {  
        res.on('data', function(data) {
          console.log("Response:");
          console.log(JSON.parse(data));
        });
      });
      
      req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
      });
      
      req.write(JSON.stringify(data));
      req.end();     
}

async function sendPushOneUser(title, message, idUser) {
    var user = await usuario.findById(idUser)
    sendPush(title, message, user.id_device)
}

module.exports = {
    suscribe,
    sendPushOneUser,
    sendPushUnidad
}


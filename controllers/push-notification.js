
const https = require('https');
const permisos = require('../permisos');
const Cliente = require('../models').cliente;
const Operador = require('../models').operador;
const Usuario = require('../models').usuario;
const clienteOperador = require('../models').clienteOperador;

async function suscribe (req, res) {
    var id_usuario = req.usuario;
    var rol = req.rol;
    var id_device = req.body.id_device;
    var response;
    try {
        if (rol == permisos.CLIENTE) {
            response = await Cliente.update(id_usuario, {id_device})
        } else if (rol == permisos.USUSARIO) {
            response = await Usuario.update(id_usuario, {id_device})
        } else {
            response = await Operador.update(id_usuario, {id_device})
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
    var idsDevices = [], operadores, cliente;
    try {
        operadores = await clienteOperador.findAllOperadores(id_unidad, 'id_unidad');
        cliente = await clienteOperador.findOneCliente(id_unidad, 'id_unidad')
    } catch(err) {
        return err;
    }

    for (var i = 0; i < operadores.length; i++) {
        if (operadores[i].id_device) idsDevices.push(operadores[i].id_device)
    }
    if (cliente.length && cliente[0].id_device) idsDevices.push(cliente[0].id_device)

    if (idsDevices.length > 0) sendPush('Nuevo pedido!!!', 'Ha recibido un nuevo pedido', idsDevices)
}

async function sendPush(title, message, idDevices) {
    var response = '';
    var data = {
        app_id: "f1809dc0-2ff4-4560-8f82-38ee0c57a5e5",
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
            response += data;
        });

        res.on('end', () => {
            console.log(JSON.parse(response).explanation);
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
    var user = await Usuario.findById(idUser)
    sendPush(title, message, user.id_device)
}

module.exports = {
    suscribe,
    sendPushOneUser,
    sendPushUnidad
}


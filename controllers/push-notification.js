
const https = require('https');
const ROLES = require('../config/roles');
const Cliente = require('../models').cliente;
const Operador = require('../models').operador;
const Usuario = require('../models').usuario;
const clienteOperador = require('../models').clienteOperador;
const ONE_SIGNAL = require('../settings').ONE_SIGNAL


// public functions
async function subscribe (req, res) {
    var id_usuario = req.usuario;
    var rol = req.rol;
    var id_device = req.body.id_device;
    var response;
    try {
        if (rol == ROLES.CLIENTE) {
            response = await Cliente.update(id_usuario, {id_device})
        } else if (rol == ROLES.USUSARIO) {
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

/* envia notificacion a aplicacion de usuario*/
async function sendPushAllUserApp (req, res) {
    var id_usuario = req.usuario;
    var rol = req.rol; 
    var titulo = req.body.titulo;
    var mensaje = req.body.mensaje;
    var url = req.body.url;
    if (!titulo || !mensaje || !url ) return res.status(404).send({code:"ERROR", message:"faltan datos"})
    var data = {
        type: 'promocion',
        url: url
    }
    sendPushSegments(titulo, mensaje, ['All'], data, ONE_SIGNAL.app);
    return res.status(200).send({code: "SUCCESS", message: ""});
}

/* envia notificacion a aplicacion de usuario*/
async function sendPushOneUserApp (titulo, mensaje, ids, data) {
    sendPushIds(titulo, mensaje, ids, data, ONE_SIGNAL.app);
}

/* envia notificacion a aplicacion de unidad*/
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

    if (idsDevices.length > 0) {
        sendPushIds('Nuevo pedido!!!', 'Ha recibido un nuevo pedido', idsDevices, extraContent = {}, settings = ONE_SIGNAL.portal_client)
    }
}


// PRIVATE FUNCTION

function getTemplateData(title, message, extraContent) {
    return {
        data: extraContent,
        headings: {en: title},
        contents: {en: message}
    };
}

function sendPush(data, settings) {
    var response = '';
    data.app_id = settings.app_id;

    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + settings.token
      };
      
      var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };
      
      return new Promise(function (resolve, reject) {
        var req = https.request(options, function(res) {
            res.on('data', function(data) {
                response += data;
            });
    
            res.on('end', () => {
                console.log(JSON.parse(response));
                resolve(response);
            });
    
          });
          
          req.on('error', function(e) {
            console.log("ERROR:");
            console.log(e);
            reject(e);
          });
          
          req.write(JSON.stringify(data));
          req.end();  
      });   
}

async function sendPushIds(title, message, ids, extraContent = {}, settings = ONE_SIGNAL.default) {
    var data = getTemplateData(title, message, extraContent);
    data.include_player_ids = ids;
    sendPush(data, settings);
}

async function sendPushSegments(title, message, segments = ['All'], extraContent = {}, settings = ONE_SIGNAL.default) {
    var data = getTemplateData(title, message, extraContent);
    data.included_segments = segments;
    sendPush(data, settings);
}

module.exports = {
    // servicios
    sendPushAllUserApp,
    subscribe,
    // function
    sendPushOneUserApp,
    sendPushUnidad
}


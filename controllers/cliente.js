'use strict'

const cliente   = require('../models').cliente;
const utils     = require('./utils');
const SHA256    = require("crypto-js/sha256");
const jwtUtils  = require('../libs/jwt-utils');
const clienteOperador = require('../models/cliente-operador');
const operador  = require('../models/operador');

const ROLES       = require('../config/roles');

function get(req, res) {
    cliente.findById(req.params.id)
    .then(function(result) {
        if (!result) {
            return res.status(404).send({err: "not found"});
        } else {
            return res.status(200).send(result);
        }
    })
    .catch(function(err) {
        return res.status(500).send({code: "ERROR", message: "", data: err});
    });
}

function getLista(req, res) {
    cliente.findAll()
    .then(function(result){
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
  let isValid = utils.andValidate(['razon_social', 'telefono', 'direccion', 'correo_electronico', 'password'], req.body)
  if (!isValid) return res.status(400).send({message: 'faltan parametros'})
  cliente.create(req.body)
  .then(function(result) {
    return res.status(200).send({id: result.insertId});
  })
  .catch(function(err) {
    return res.status(500).send({err: err})
  })

}

async function login(req, res) {
    try {
        var usr = await cliente.findOne({
            where: {correo_electronico: req.body.correo_electronico}
        })
        if (!usr) return res.status(404).send({code: "ERROR", message: "not found"});
        let shaPass = SHA256(req.body.password);
        if (shaPass == usr.password) {
            var profile = makeProfile(usr);
            return res.status(200).send({code:"SUCCESS", message: "", data: profile});
        } else {
            return res.status(401).send({code:'ERROR', message: 'usuario no autorizado'});
        }
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

async function getProfile(req, res) {
    var id = req.usuario;
    try {
        var usr = await cliente.findOne({where: {id}});
        if (!usr) return res.status(404).send({code: "ERROR", message: "not found"});
        var profile = makeProfile(usr);
        return res.status(200).send({code:"SUCCESS", message: "", data: profile});
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

function makeProfile(usr) {
    return {
        id_usuario: usr.id,
        token: jwtUtils.createToken(usr.id, ROLES.CLIENTE),
        nombre_usuario: usr.representante_legal,
        id_cliente: usr.id,
        rol: ROLES.CLIENTE
    }
}

async function addOperador(req, res) {
    const { correo_electronico, rol, id_unidad } = req.body;
    const id_usuario = req.usuario;
    try {
        var op = await operador.findOne({where: {correo_electronico}});
        if (!op || !op.id) return res.status(404).send({code:"ERROR", message:"Usurio no encontrado"})
        if (req.rol == ROLES.CLIENTE) {
            var response = await clienteOperador.create({id_cliente: id_usuario, id_unidad, id_operador: op.id, rol})
            return res.status(200).send({code: "SUCCESS", message:""});
        }
    } catch(err) {
        return res.status(500).send({code:"ERROR", message: "", error: err});
    }
}

async function updateOperador(req, res) {
    var id_cliente;
    var rol = req.rol;
    var id_operador = req.query.id_operador
    if (rol == ROLES.CLIENTE) {
        id_cliente = req.usuario;
        try {
            var response = await clienteOperador.update(id_cliente, id_operador, req.body);
            return res.status(200).send({code: "SUCCESS", message:""});
        } catch(err) {
            return res.status(500).send({code:"ERROR", message: "", error: err});
        }
         
    } else {
        return res.status(404).send({code: "SUCCESS", message:"serivicio en construccion"});
    }
}

async function deleteOperador(req, res) {
    var idOperador = req.query.id_operador;
    var idCliente = req.usuario;
    try {
        var response = await clienteOperador.deleteR(idOperador, idCliente)
        return res.status(200).send({code: "SUCCESS", message:"", affectedRows: response.affectedRows});
    } catch(err) {
        return res.status(500).send({code:"ERROR", message: "", error: err});
    }
}

function getListOperadores(req, res) {
    var id_usuario = req.usuario;
    var rol = req.rol;
    if (rol == ROLES.CLIENTE) {
        clienteOperador.findAllOperadores(id_usuario)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(err => {
            return res.status(500).send({err});
        });
    } else {
        return res.status(401).send({code: "ERROR", message: "usuario no autorizado"})
    }
}

function update(req, res) {

}

module.exports = {
    get,
    getLista,
    create,
    update,
    login,
    addOperador,
    getListOperadores,
    deleteOperador,
    updateOperador,
    getProfile
}

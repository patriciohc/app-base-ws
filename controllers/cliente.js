'use strict'

const cliente = require('../models').cliente;
const utils = require('./utils');
const SHA256 = require("crypto-js/sha256");
const Auth = require('./autentication');
const permisos = require('../permisos');

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
        return res.status(500).send({err});
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
        if (!usr) return res.status(404).send({message: "not found"});
        let shaPass = SHA256(req.body.password);
        if (shaPass == usr.password) {
            var sesion = {
                id_usuario: usr.id,
                token: Auth.createToken(usr.id, permisos.CLIENTE),
                nombre_usuario: usr.representante_legal,
                id_cliente: usr.id,
                rol: permisos.CLIENTE
            }
            return res.status(200).send(sesion);
        } else {
            return res.status(401).send({code:'SUCCESS', message: 'usuario no autorizado'});
        }
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

async function addOperador(req, res) {
    var correo_electronico = req.body.correo_electronico;
    var rol = req.body.rol;
    var id_unidad = req.body.id_unidad;
    var op = await operador.findOne({where: {correo_electronico}});

    clienteOperador.create({id_unidad, id_operador: op.id, rol})
    .then(result => {
        return res.status(200).send({success: true});
    })
    .catch(err => {
        return res.status(500).send({err: err});
    });
}

function getListOperadores(req, res) {
    var id_usuario = req.usuario;
    var rol = req.rol;
    if (rol == permisos.CLIENTE) {
        clienteOperador.findAllOperadores(req.query.id_cliente)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(err => {
            return res.status(500).send({err});
        });
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
    getListOperadores
}

'use strict'

const operador = require('../models').operador;
const clienteOperador = require('../models').clienteOperador;
const catalogos = require('./catalogos');
const SHA256 = require("crypto-js/sha256");
const Auth = require('./autentication');

function get(req, res) {
    operador.findById(req.params.id)
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

function create(req, res) {
    if (!req.body.correo_electronico) 
        return res.status(400).send({code: 'ERROR', message: 'falta correo electronico'});
    operador.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

async function siginUnidad(req, res) {
    var id_usuario = req.usuario;
    var id_unidad = req.query.id_unidad;
    try {
        var usr = await operador.findById(id_usuario)
        if (!usr) return res.status(404).send({message: "not found"});
        var unidad = await clienteOperador.findOne({where: {id_operador: usr.id, id_unidad: id_unidad}})
            var sesion = {
                id_usuario: usr.id,
                token: Auth.createToken(usr.id, unidad.rol),
                nombre_usuario: usr.nombre,
                id_unidad: unidad.id_unidad,
                id_cliente: unidad.id_cliente,
                rol: unidad.rol
            }
            return res.status(200).send(sesion);
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

async function getListUnidades(req, res) {
    var id_usuario = req.usuraio;
    try {
        var unidades = await clienteOperador.findAll({where: {id_operador: id_usuario}})
        return res.status(200).send(unidades);
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

async function login(req, res) {
    try {
        var usr = await operador.findOne({
            where: {correo_electronico: req.body.correo_electronico}
        })
        if (!usr) return res.status(404).send({message: "not found"});
        var sha = SHA256(req.body.password).toString();
        console.log(sha)
        if (sha == usr.password) {
            var unidades = await clienteOperador.findAll({where: {id_operador: usr.id}})
            var sesion = {
                id_usuario: usr.id,
                token: Auth.createToken(usr.id, permisos.SIN_ROL),
                nombre_usuario: usr.nombre,
                unidades: unidades,
                rol: permisos.SIN_ROL
            }
            return res.status(200).send(sesion);
        } else {
            return res.status(401).send({code:'SUCCESS', message: 'usuario no autorizado'});
        }
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

async function loginRepartidor(req, res) {
    try {
        var usr = await operador.findOne({
            where: {correo_electronico: req.body.correo_electronico}
        })
        if (!usr) return res.status(404).send({message: "not found"});
        var sha = SHA256(req.body.password).toString();
        console.log(sha)
        if (sha == usr.password) {
            var repartidor = await clienteOperador.findOne({where: {id_operador: usr.id, rol: permisos.REPARTIDOR}})
            if (!repartidor) return res.status(403).send({code:"ERROR", message:"usuario no autorizado"})
            var sesion = {
                id_usuario: usr.id,
                token: Auth.createToken(usr.id, permisos.REPARTIDOR),
                nombre_usuario: usr.nombre,
                rol: permisos.REPARTIDOR
            }
            return res.status(200).send(sesion);
        } else {
            return res.status(401).send({code:'SUCCESS', message: 'usuario no autorizado'});
        }
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: '', err: err});
    }
}

function update(req, res) {

}

function getRoles(req, res) {
    return res.status(200).send(catalogos.ROLES);
}

module.exports = {
    get,
    // getLista,
    create,
    update,
    login,
    getRoles,
    siginUnidad,
    getListUnidades,
    loginRepartidor
}

'use strict'

const Operador  = require('../models').operador;
const clienteOperador = require('../models').clienteOperador;
const catalogos = require('./catalogos');
const SHA256    = require("crypto-js/sha256");
const Auth      = require('../libs/jwt-utils');
const Email     = require('../libs/nodemailer');
const config    = require('config');
const ROLES     = require('../config/roles');

function get(req, res) {
    Operador.findById(req.params.id)
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

async function create(req, res) {
    const { correo_electronico } = req.body;
    if (!correo_electronico) {
        return res.status(400).send({code: 'ERROR', message: 'falta correo electronico'});
    }
    try {
        let response = await Operador.create(req.body);
        // let response = {insertId: 1};
        let token = Auth.createToken(response.insertId, 'verify_email');
        let data = {
            url: config.host + '?token= ' + token 
        }
        // Email.sendMail(Email.VERIFY_EAMIL, correo_electronico, data)
        return res.status(200).send({code: 'SUCCESS', message: '', data: {id: response.insertId}});
    } catch (err) {
        return res.status(500).send({code:'ERROR', message: '', data: err})
    }
}

/**
 * Genera link y envia a correo electronico para recuperar reestableces password
 */
async function passwordRecovery(req, res) {
    const { correo_electronico } = req.body;
    if (!correo_electronico) {
        return res.status(400).send({code: 'ERROR', message: 'correo_electronico es requerido'});
    }
    try {
        let operador = await Operador.findOne({where:{correo_electronico}});
        let token = Auth.createToken(operador.id, 'password_recovery');
        let data = {
            url: config.host + '/admin-client/recuperar-contrasena;token=' + token
        }
        console.log(data.url);
        // Email.sendMail(Email.VERIFY_EAMIL, correo_electronico, data)
        return res.status(200).send({code: 'SUCCESS', message: 'enviamos un mensaje a tu cuenta de correo para reestablecer la contraseña'});
    } catch (err) {
        return res.status(500).send({code:'ERROR', message: '', data: err})
    }
}

/**
 * cambia password
 */
async function passwordReset(req, res) {
    const { usuario, rol } = req;
    const { password } = req.body;
    if (rol != 'password_recovery') {
        return res.status(400).send({code: 'ERROR', message: 'token invalido'});
    }
    try {
        let response = await Operador.update(usuario, {password});
        return res.status(200).send({code: 'SUCCESS', message: 'your password was updated'});
    } catch (err) {
        return res.status(500).send({code:'ERROR', message: '', data: err})
    }
}

async function siginUnidad(req, res) {
    var id_usuario = req.usuario;
    var id_unidad = req.query.id_unidad;
    try {
        var usr = await Operador.findById(id_usuario)
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
        var usr = await Operador.findOne({
            where: {correo_electronico: req.body.correo_electronico}
        })
        if (!usr) return res.status(404).send({code:"ERROR", message: "not found"});
        var sha = SHA256(req.body.password);
        if (sha == usr.password) {
            var profile = await makeProfile(usr);
            return res.status(200).send({code: "SUCCESS", message: "", data: profile});
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
        var usr = await Operador.findOne({ where: {id}});
        if (!usr) return res.status(404).send({code:"ERROR", message: "not found"});
        var profile = await makeProfile(usr);
        return res.status(200).send({code: "SUCCESS", message: "", data: profile});
    } catch(err) {
        return res.status(500).send({code: "ERROR", message: "", data: err});
    }

}


async function makeProfile (usr) {
    var unidades = await clienteOperador.findAll({where: {id_operador: usr.id}})
    return {
        id_usuario: usr.id,
        token: Auth.createToken(usr.id, ROLES.SIN_ROL),
        nombre_usuario: usr.nombre,
        unidades: unidades,
        rol: ROLES.SIN_ROL
    }
}

async function loginRepartidor(req, res) {
    try {
        var usr = await Operador.findOne({
            where: {correo_electronico: req.body.correo_electronico}
        })
        if (!usr) return res.status(404).send({message: "not found"});
        var sha = SHA256(req.body.password).toString();
        console.log(sha)
        if (sha == usr.password) {
            var repartidor = await clienteOperador.findOne({where: {id_operador: usr.id, rol: ROLES.REPARTIDOR}})
            if (!repartidor) return res.status(403).send({code:"ERROR", message:"usuario no autorizado"})
            var sesion = {
                id_usuario: usr.id,
                token: Auth.createToken(usr.id, ROLES.REPARTIDOR),
                nombre_usuario: usr.nombre,
                rol: ROLES.REPARTIDOR
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
    loginRepartidor,
    getProfile,
    passwordRecovery,
    passwordReset
}

'use strict'

const usuario = require('../models').usuario;
const admin = require('../models/administrator')
const SHA256 = require("crypto-js/sha256");
const Auth = require('./autentication');
const permisos = require('../permisos');
const utils = require('./utils');

function login(req, res) {
    usuario.findOne({
      select: ['id', 'correo_electronico', 'nombre', 'telefono', 'recibir_promociones'],
      where:{correo_electronico: req.body.correo_electronico}
    })
    .then(function(result) {
        console.log(result);
        if (!result) {
            return res.status(404).send({message: "not found"});
        } else {
          let shaPass = SHA256(req.body.password)
          if (shaPass == result.password) {
            result.token = Auth.createToken(result.id, permisos.CLIENTE)
            return res.status(200).send(result);
          } else {
            return res.status(401).send({message: "usuario no autorizado"});
          }
        }
    })
    .catch(function(err) {
        return res.status(500).send({err});
    });
}

function login_admin(req, res) {
    let user = admin.findOne(req.body.correo_electronico)
    if (!user) {
      return res.status(404).send({message: "administrador no encontrado"});
    }
    let shaPass = SHA256(req.body.password)
    if (shaPass == user.password) {
      user.token = Auth.createToken(user.id, permisos.ADMINISTRADOR)
      return res.status(200).send(user);
    } else {
      return res.status(401).send({message: "usuario no autorizado"});
    }
}

function create(req, res) {
    let isValid = utils.andValidate(['correo_electronico', 'nombre', 'password'], req.body)
    if (!isValid) return res.status(400).send({message: 'faltan parametros'})
    usuario.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function update(req, res) {

}

module.exports = {
    login,
    create,
    update,
    login_admin
}

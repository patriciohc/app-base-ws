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

function login(req, res) {
    cliente.findOne({
      where: {correo_electronico: req.body.correo_electronico}
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

function update(req, res) {

}

module.exports = {
    get,
    getLista,
    create,
    update,
    login,
}

'use strict'

const usuario = require('../models').usuario;

function login(req, res) {
    usuario.findById(req.params.email)
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

function createUsuario(req, res) {
    usuario.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })

}

function updateUsuario(req, res) {

}

module.exports = {
    login,
    createUsuario,
    updateUsuario,
}

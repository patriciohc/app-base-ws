'use strict'

const usuario = require('../models').usuario;

function login(req, res) {
    usuario.findOne({where:{correo_electronico: req.body.correo_electronico}})
    .then(function(result) {
        if (!result) {
            return res.status(404).send({message: "not found"});
        } else {
            if (req.body.password == result.password) {
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

function create(req, res) {
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
}

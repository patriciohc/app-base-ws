'use strict'

const operador = require('../models').operador;
const permisos = require('../permisos')

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

function getLista(req, res) {
    operador.findAll()
    .then(function(result){
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    operador.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })

}

function login(req, res) {
    operador.findOne({where:{correo_electronico: req.body.correo_electronico}})
    .then(function(result) {
        console.log(result);
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

function update(req, res) {

}

function getRoles(req, res) {
    return res.status(200).send([
        {
            id: permisos.REPARTIDOR,
            nombre: 'Repartidor'
        }, {
            id: permisos.OPERADOR_UNIDAD,
            nombre: 'Operador de unidad'
        }, {
            id: permisos.ADMIN_UNIDAD,
            nombre: 'Administrador de unidad'
        }, {
            id: permisos.ADMIN_CLIENTE,
            nombre: 'Administrador'           
        }
    ])

}

module.exports = {
    get,
    getLista,
    create,
    update,
    login,
    getRoles
}

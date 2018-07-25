'use strict'

const express       = require('express');
const api           = express.Router();
const pedido        = require('../controllers/pedido');
const autentication =  require('../middleware/autentication');
const rol           = require('../config/roles');

/*
* path /pedido/
*/


/**
* @api {get} /pedido/ obtiene lista de pedidos en una unidad
* @apiGroup pedido
* @apiParam {number} id_cliente
* @apiParam {number} id_unidad
* @apiSuccess {Object[]} lista de pedidos
*/
api.get(
    '/', 
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    pedido.getListaPorUnidad
);

module.exports = api;
'use strict'

const express       = require('express');
const api           = express.Router();
const pedido        = require('../controllers/pedido');
const autentication =  require('../middleware/autentication');
const ROLES         = require('../config/roles');

/*
* path /pedido/
*/

/**
* @api {post} /pedido/ Crea un pedido
* @apiGroup pedido
* @apiParam {Pedido} objeto de tipo Pedido
* @apiSuccess {number} numero de pedido
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
// rol.add('/pedido/', 'POST', [rol.USUSARIO])
api.post(
    '/',
    autentication.isAuth([ROLES.USUSARIO]),
    pedido.create
);

/**
* @api {delete} /pedido/ elimina pedido
* @apiGroup pedido
* @apiParam {number} id identificador de pedido
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
// rol.add('/pedido/', 'DELETE', [rol.USUSARIO])
api.delete(
    '/',
    autentication.isAuth([ROLES.USUSARIO]),
    pedido.deleteR
);

/**
* @api {get} /pedido/ obtiene lista de pedidos en una unidad
* @apiGroup pedido
* @apiParam {number} id_cliente
* @apiParam {number} id_unidad
* @apiSuccess {Object[]} lista de pedidos
*/
api.get(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]),
    pedido.getListaPorUnidad
);

module.exports = api;
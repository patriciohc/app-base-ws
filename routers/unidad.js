'use strict'
const express       = require('express');
const api           = express.Router();
const ROLES           = require('../config/roles');
const autentication = require('../middleware/autentication');

const Unidad = require('../controllers/unidad');

/**
 * path /unidad
 */

/**
* @api {post} /unidad-producto agrega productos a la unidad
*
* @apiGroup Unidad
* @apiParam {Number[][]} id_unidad, id_producto
* @apiSuccess {Object} success
*/
api.post(
    '/producto/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Unidad.addProducto
);

/**
* @api {get} /unidad-producto obtiene todos los productos en una unidad
*
* @apiGroup Unidad
* @apiParam {Number} id_unidad in query , obligatorio
* @apiParam {Number} texto in query texto de busqueda, opcional
* @apiParam {Number} categoria in query cateogira de los productos, opcional
* @apiSuccess {Object[]} lista de productos
*/
api.get('/producto/', Unidad.getProductos);

module.exports = api;
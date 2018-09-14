'use strict'
const express       = require('express');
const api           = express.Router();
const ROLES           = require('../config/roles');
const autentication = require('../middleware/autentication');

const Venta = require('../controllers/venta-en-sitio');

/**
 * path /venta/grafica
 */

/**
* @api {get} /venta agrega una nueva venta en sitio
*
* @apiGroup venta
* @apiParam {string} - fechaIni
* @apiParam {string} - fechaFin
* @apiSuccess {Array}
*/
api.post(
    '/grafica', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Venta.getVestasByWeek
);

/**
 * path /venta
 */

/**
* @api {post} /venta agrega una nueva venta en sitio
*
* @apiGroup venta
* @apiParam {Venta} 
* @apiSuccess {Venta}
*/
api.post(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Venta.create
);

/**
* @api {delete} /venta/ elimina venta
*
* @apiGroup Unidad
* @apiParam {number} id - id de la venta
* @apiSuccess {Object}
*/
api.delete(
    '/:id',
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Venta.del
);

/**
* @api {put} /venta/ actualiza venta
*
* @apiGroup venta
* @apiParam {Object} 
* @apiSuccess {Object} success
*/
// api.put(
//     '/:id',
//     autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
//     Venta.update
// );

/**
* @api {get} /venta obtiene lista de ventas filtra segun datos pasados por query.
*
* @apiGroup venta
* @apiSuccess {Object[]} lista de ventas
*/
api.get(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Venta.getList
);

/**
* @api {get} /venta/ obtiene el detalle de una venta
* @apiName venta
* @apiParam {number} id
* @apiSuccess {Unidad} lista de objetos unidad
*/
api.get(
    '/:id', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Venta.get
);

module.exports = api;
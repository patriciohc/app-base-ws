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
* @api {post} /unidad/producto elimina producto una unidad
*
* @apiGroup Unidad
* @apiParam {number} id_producto
* @apiParam {number} id_unidad
* @apiSuccess {Object} success
*/
api.delete(
    '/producto/',
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Unidad.delProductoUnidad
);

/**
* @api {post} /unidad/producto actualiza estatus
*
* @apiGroup Unidad
* @apiParam {number} id_producto
* @apiParam {number} id_unidad
* @apiSuccess {Object} success
*/
api.put(
    '/producto/',
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Unidad.updataUnidadProducto
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

/**
* @api {get} /unidad/ Obtitene lista de unidades, en base a los parametros
* pasados por query.
*
* @apiName GetUnidad
* @apiGroup Unidad
* @apiParam {Float} lat latitud de la ubicacion
* @apiParam {Float} lng longitud de la ubicacion
*
* @apiSuccess {Unidad} lista de objetos unidad
*/
// -- no requiere rol
api.get('/', Unidad.findUnidades);

/**
* @api {post} /unidad crea una unidad nueva
*
* @apiGroup Unidad
* @apiParam {Object} objeto de tipo Unidad en body
* @apiSuccess {number} id de la unidad creada
*/
api.post(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    Unidad.create
);

/**
* @api {post} /unidad actuliza la informacion basica de una unidad
*  nombre, telefono, hora_apetura, hora_cierre, imagen, palabras_clave, descripcion
* @apiGroup Unidad
* @apiParam {Object} objeto de tipo Unidad en body
* @apiSuccess {number} id de la unidad creada
*/
api.put(
    '/',
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]),
    Unidad.updateInfoBasic
);

/**
* @api {delete} /unidad elimina unidad
*
* @apiGroup Unidad
* @apiParam {number} id_unidad de uniad por query
* @apiSuccess {Object} success
*/
// rol.add('/unidad/', 'DELETE', [rol.CLIENTE])
api.delete(
    '/', 
    autentication.isAuth([ROLES.CLIENTE]), 
    Unidad.deleteR);

/**
* @api {get} /unidad/:id Obtiene una unidad
* @apiGroup Unidad
* @apiParam {number} id de unidad
* @apiSuccess {Object} obejto Unidad
*/
api.get('/:id', Unidad.get);


module.exports = api;
'use strict'
const express       = require('express');
const api           = express.Router();
const autentication = require('../middleware/autentication');
const ROLES         = require('../config/roles');

const producto = require('../controllers/producto');

/*
* path /producto
*/

/**
* @api {post} /producto/ Crea un producto
* @apiGroup producto
* @apiParam {Producto} objeto de tipo Producto
* @apiSuccess {number} id de objeto insertado
*/
// rol.add('/producto/', 'POST', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.post(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]),
    producto.create
);

/**
* @api {put} /producto/ actualiza producto
* @apiGroup producto
* @apiParam {Producto} objeto de tipo Producto
* @apiParam {number} id de objeto
*/
// rol.add('/producto/', 'PUT', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.put(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    producto.update
);

/**
* @api {get} /producto/ filtra productos segun query
* @apiGroup producto
* @apiParam {id_cliente} id de cliente 
* @apiParam {id_categorita} id de cateogira 
* @apiSuccess {array} array de productos
*/
api.get('/', producto.getLista);

/**
* @api {get} /producto/ detalle de producto para consulta de clientes
* @apiGroup producto
* @apiParam {number} id identificador
* @apiSuccess {Producto} array de productos
*/
// rol.add('/producto-detalle/', 'GET', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.get(
    '/detalle/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    producto.getDetalle
);

/**
* @api {delete} /producto/ elimina producto por id
* @apiGroup producto
* @apiParam {number} id identificador de producto
* @apiSuccess {Boolean} respuesta
*/
// rol.add('/producto/', 'DELETE', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.delete(
    '/', 
    autentication.isAuth([ROLES.CLIENTE, ROLES.OPERADOR_UNIDAD]), 
    producto.deleteR
);

/**
* @api {get} /producto/ obtiene producto por id
* @apiGroup producto
* @apiParam {id_producto} id de cliente 
* @apiSuccess {object}  producto
*/
api.get('/:id', producto.get);

module.exports = api;
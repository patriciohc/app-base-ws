'use strict'

const express = require('express');
const api = express.Router();
const cliente = require('./controllers/cliente');
const unidad = require('./controllers/unidad');
//const middleware = require('../middleware');

// user
// api.get('/usuario/', controllers.getListaUsuarios);
// api.get('/usuario/:id', controllers.getUsuario);
// api.post('/usuario/', controllers.crearUsaurio);
// api.post('/usuario/:id', controllers.actualizarUsaurio);

/**
* @api {get} /unidad/:id Obtitene unidad
* @apiName GetUnidad
* @apiGroup Unidad
* @apiParam {Number} id identificador unico
* @apiSuccess {Unidad} obejto unidad
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     Unidad
* @apiError UserNotFound The id of the User was not found.
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "error": "error"
*     }
*/
api.get('/unidad/:id', unidad.getUnidad);

/**
* @api {get} /unidad/ Obtitene lista de unidades, en base a los parametros
* pasados por query.
*
* @apiName GetUnidad
* @apiGroup Unidad
*
* @apiParam {Float} lat latitud de la ubicacion
* @apiParam {Float} lng longitud de la ubicacion
* @apiParam {String} estado
* @apiParam {String} Municipio
*
* @apiSuccess {Unidad} lista de objetos unidad
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     [Unidad]
*
* @apiError UserNotFound The id of the User was not found.
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "error": "error"
*     }
*/
//api.put('/unidad', controllers.getListaUnidad);

/**
* @api {post} /unidad
* @apiGroup Unidad
* @apiParam {unidad} objeto de tipo unidad
* @apiSuccess {number} id de la unidad creada
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
* @apiError UserNotFound The id of the User was not found.
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "error": "error"
*     }
*/
api.post('/unidad', unidad.createUnidad);

//api.put('/unidad', controllers.updateUnidad);


/**
* Cliente
*/

/**
* @api {get} /cliente/:id
* @apiGroup Cliente
* @apiParam {number} id identificado unico de cliente
* @apiSuccess {Cliente} obejto de tipo cliente
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.get('/cliente/:id', cliente.getCliente);

/**
* @api {get} /cliente
* @apiGroup Cliente
* @apiSuccess {Array} arrya de tipo cliente
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     []
*/
api.get('/cliente/', cliente.getListaCliente);

/**
* @api {post} /cliente/ Crea unidad
*
* @apiGroup Cliente
*
* @apiParam {Cliente} objeto de tipo cliente
*
* @apiSuccess {number} id de objeto insertado
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
*/
api.post('/cliente', cliente.createCliente);

//api.put('/cliente', controllers.updateCliente);

module.exports = api;

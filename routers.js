'use strict'

const express = require('express');
const api = express.Router();
const cliente = require('./controllers/cliente');
const unidad = require('./controllers/unidad');
const usuario = require('./controllers/usuario');
const poligono = require('./controllers/poligono');
const categoria = require('./controllers/categoria');
const producto = require('./controllers/producto');
const multer  = require('multer');

var upload = multer({ dest: './kml' });
//const middleware = require('../middleware');

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
api.get('/unidad/:id', unidad.get);

/**
* @api {post} /unidad/ Obtitene lista de unidades, en base a los parametros
* pasados por query.
*
* @apiName GetUnidad
* @apiGroup Unidad
* @apiParam {Float} lat latitud de la ubicacion
* @apiParam {Float} lng longitud de la ubicacion
*
* @apiSuccess {Unidad} lista de objetos unidad
*/
api.get('/unidad', unidad.getLista);

/**
* @api {post} /unidad
* @apiGroup Unidad
* @apiParam {Unidad} objeto de tipo unidad
* @apiSuccess {number} id de la unidad creada
*/
api.post('/unidad/', upload.single('file_kml'), unidad.create);

//api.put('/unidad', controllers.updateUnidad);

/**
* Poligono
*
* @api {put} /unidad/ Obtitene lista de unidades, en base a los parametros
* pasados por query.
*
* @apiName GetUnidad
* @apiGroup Unidad
* @apiParam {File} mkl archivo con poligono
* @apiParam {Number} id_unidad
*
* @apiSuccess {Boolean}
*/
api.put('/poligono', poligono.update);


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
api.get('/cliente/:id', cliente.get);

/**
* @api {get} /cliente
* @apiGroup Cliente
* @apiSuccess {Array} arrya de tipo cliente
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     []
*/
api.get('/cliente/', cliente.getLista);

/**
* @api {post} /cliente/ Crea unidad
* @apiGroup Cliente
* @apiParam {Cliente} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
*/
api.post('/cliente', cliente.create);

/**
* @api {post} /cliente-login/ logea cliente
*
* @apiGroup Cliente
*
* @apiParam {String} - correo_electronico
* @apiParam {String} - password
* @apiSuccess {Cliente} id de objeto Cliente
*
*/
api.post('/login-cliente', cliente.login);

//api.put('/cliente', controllers.updateCliente);


/**
* Usuario de la app
*/

/**
* @api {post} /login/
* @apiGroup usuario
* @apiParam {string} correo_electronico
* @apiParam {string} password
* @apiSuccess {Usuario} obejto de tipo cliente
*/
api.post('/login/', usuario.login);

/**
* @api {post} /cliente/ Crea usuario
* @apiGroup usuario
* @apiParam {Usuario} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
*/
api.post('/usuario', usuario.create);

/**
* @api {post} /categoria/ Crea una categoria
* @apiGroup Categoria
* @apiParam {Cliente} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
*/
api.post('/categoria', categoria.create);

/**
* @api {get} /categoria/ filtra categorias por id de unidad
* @apiGroup Categoria
* @apiParam {number} id identificador de unidad
* @apiSuccess {array} array de categorias
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
*/
api.get('/categoria', categoria.getLista);

/**
* @api {post} /producto/ Crea una categoria
* @apiGroup producto
* @apiParam {Producto} objeto de tipo Producto
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.post('/producto', producto.create);

/**
* @api {get} /producto/ filtra categorias por id de categoria
* @apiGroup producto
* @apiParam {number} id identificador de categoria
* @apiSuccess {array} array de productos
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*
*/
api.get('/producto', producto.getLista);


module.exports = api;

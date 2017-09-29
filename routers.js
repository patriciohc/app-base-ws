'use strict'

const express = require('express');
const api = express.Router();
const cliente = require('./controllers/cliente');
const unidad = require('./controllers/unidad');
const usuario = require('./controllers/usuario');
const poligono = require('./controllers/poligono');
const categoria = require('./controllers/categoria');
const producto = require('./controllers/producto');
const pedido = require('./controllers/pedido');
const operador = require('./controllers/operador');
const catalogos = require('./controllers/catalogos');
const multer  = require('multer');

var upload = multer({ dest: './kml' });
//const middleware = require('../middleware');


api.get('/catalogos', catalogos.get)

/**
* @api {get} /unidad/:id Obtiene una unidad
* @apiGroup Unidad
* @apiParam {Number} id identificador unico
* @apiSuccess {Object} obejto Unidad
* @apiSuccessExample {json} Success-Response:
*   HTTP/1.1 200 OK
*   {
*
*   }
* @apiError UserNotFound The id of the User was not found.
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "error": "info error"
*     }
*/
api.get('/unidad/:id', unidad.get);

/**
* @api {get} /unidad-cliente/ obitiene unidad por cliente
* @apiGroup Unidad
* @apiParam {number} id_cliente identificador unico de cliente
* @apiSuccess {Object} obejto de tipo unidad
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
*
*     }
*/
api.get('/unidad-cliente/', unidad.get);

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
api.get('/unidad', unidad.getLista);

/**
* @api {post} /unidad crea una unidad nueva recibe los parametros
* en un form-data
*
* @apiGroup Unidad
* @apiParam {Object} objeto de tipo Unidad
* @apiSuccess {number} id de la unidad creada
*/
api.post('/unidad/', upload.single('file_kml'), unidad.create);

/**
* @api {post} /unidad-producto agrega productos a la unidad
*
* @apiGroup Unidad
* @apiParam {Number[][]} id_unidad, id_producto
* @apiSuccess {Object} success
*/
api.post('/unidad-producto/', unidad.addProducto);

/**
* @api {get} /unidad-producto obtiene todos los productos en una unidad
*
* @apiGroup Unidad
* @apiParam {Number} id_unidad
* @apiSuccess {Object[]} lista de productos
*/
api.get('/unidad-producto/', unidad.getProductos);

/**
* @api {post} /unidad-operador agrega operadores a unidad
*
* @apiGroup Unidad
* @apiParam {Number[][]} id_unidad, id_operador
* @apiSuccess {Boolean} success
*/
api.post('/unidad-operador/', operador.addOperador);

/**
* @api {get} /unidad-operador obtiene todos los operadores en una unidad
*
* @apiGroup Unidad
* @apiParam {Number} id_unidad
* @apiSuccess {Object[]} lista de operadores
*/
api.get('/unidad-operador/', unidad.getLOperadoresUnidad);

/**
* @api {delete} /unidad elimina unidad
*
* @apiGroup Unidad
* @apiParam {Number} id de uniad por query
* @apiSuccess {Object} success
*/
api.delete('/unidad/', unidad.deleteR);

/**
* @api {post} /operador crea un operador
*
* @apiGroup Operador
* @apiParam {Object} Operador
* @apiSuccess {Boolean} success
*/
api.post('/operador/', operador.create);

/**
* @api {get} /operador obitiene operadores por unidad
*
* @apiGroup Operador
* @apiParam {Number} id_unidad
* @apiSuccess {Boolean} success
*/
api.get('/operador/', operador.getLista);

//api.put('/unidad', controllers.updateUnidad);

/**
* @{put} /poligono actualiza poligono
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
* @{get} /cliente obtiene cliente por id de cliente
*
* @api {get} /cliente/:id
* @apiGroup Cliente
* @apiParam {number} id identificado unico de cliente
* @apiSuccess {Object} obejto de tipo Cliente
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.get('/cliente/:id', cliente.get);

/**
* @api {get} /cliente obtiene liste de clientes
* @apiGroup Cliente
* @apiSuccess {Object[]} arrya de tipo Cliente
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     []
*/
api.get('/cliente/', cliente.getLista);

/**
* @api {post} /cliente/ Crea un nuevo cliente
* @apiGroup Cliente
* @apiParam {Object} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*   {id: id }
*/
api.post('/cliente', cliente.create);

/**
* @api {post} /cliente-login/ loguea cliente
* @apiGroup Cliente
* @apiParam {String} - correo_electronico
* @apiParam {String} - password
* @apiSuccess {Number} id de objeto Cliente
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
* @api {delete} /categoria/ elimina categoria por id
* @apiGroup Categoria
* @apiParam {Number} id de la categoria
* @apiSuccess {Boolean}
*/
api.delete('/categoria', categoria.deleteR);

/**
* @api {get} /categoria/ filtra categorias por id de unidad
* @apiGroup Categoria
* @apiParam {number} id identificador de unidad
* @apiParam {number} id identificador de cliente
* @apiSuccess {array} array de categorias
*/
api.get('/categoria', categoria.getListaPorUnidad);

/**
* @api {get} /categoria/ filtra categorias por id de cliente
* @apiGroup Categoria
* @apiParam {number} id identificador de unidad
* @apiParam {number} id identificador de cliente
* @apiSuccess {array} array de categorias
*/
api.get('/categoria-cliente', categoria.getLista);

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

/**
* @api {delete} /producto/ elimina producto por id
* @apiGroup producto
* @apiParam {number} id identificador de producto
* @apiSuccess {Boolean} respuesta
*/
api.delete('/producto', producto.deleteR);

/**
* @api {post} /pedido/ Crea un pedido
* @apiGroup pedido
* @apiParam {Pedido} objeto de tipo Pedido
* @apiSuccess {number} numero de pedido
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.post('/pedido', pedido.create);

/**
* @api {put} /pedido/ actuliza pedido
* @apiGroup pedido
* @apiParam {number} id_pedido
* @apiParam {number} estatus
* @apiSuccess {number} numero de pedido
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.put('/pedido-estatus', pedido.setEstatus);

/**
* @api {put} /pedido/ Crea un pedido
* @apiGroup producto
* @apiParam {number} id_pedido
* @apiSuccess {number} id_repartidor
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.put('/pedido-repartidor', pedido.asignarRepartidor);

/**
* @api {put} /pedido/ Crea un pedido
* @apiGroup producto
* @apiParam {number} id_pedido
* @apiSuccess {number} calificacion
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.put('/pedido-calificacion', pedido.calificar);

/**
* @api {get} /pedido/ obtiene lista de pedidos
* @apiGroup pedido
* @apiParam {number} id_cliente
* @apiParam {number} id_unidad
* @apiSuccess {Object[]} lista de pedidos
*/
api.get('/pedido', pedido.getListaPorUnidad);

/**
* @api {get} /pedido/ obtiene lista de pedidos
* @apiGroup pedido
* @apiParam {number} id_usuario
* @apiSuccess {Object[]} lista de pedidos
*/
api.get('/pedido-usuario', pedido.getListaPorUsuario);


module.exports = api;

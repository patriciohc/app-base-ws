'use strict'

const express = require('express');
const api = express.Router();
const cliente = require('./controllers/cliente');
const unidad = require('./controllers/unidad');
const usuario = require('./controllers/usuario');
const categoria = require('./controllers/categoria');
const producto = require('./controllers/producto');
const pedido = require('./controllers/pedido');
const operador = require('./controllers/operador');
const catalogos = require('./controllers/catalogos');
const autentication =  require('./controllers/autentication');
const imagen =  require('./controllers/imagen');
const permisos = require('./permisos');
const multer  = require('multer');

var upload = multer({ dest: './kml' });
//const middleware = require('../middleware');

// -- no require permisos
api.get('/catalogos', catalogos.get)

/**
* @api {get} /unidad-cliente/ obitiene unidad por cliente
* @apiGroup Unidad
* @apiParam {number} id_cliente identificador unico de cliente
* @apiSuccess {Object} obejto de tipo unidad
*/
permisos.add('/unidad-cliente/', 'GET', [permisos.CLIENTE])
api.get('/unidad-cliente/', autentication.isAuth, unidad.getListaCliente);

/**
* @api {get} /unidad/ Obtitene lista de unidades de un cliente (informacion general)
*
* @apiName GetUnidad
* @apiGroup Unidad
*
* @apiSuccess {Unidad[]} lista de objetos unidad
*/
permisos.add('/unidad-cliente/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/unidad-cliente/', unidad.getListaCliente);

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
// -- no requiere permisos
api.get('/unidad/', unidad.getLista);

/**
* @api {get} /unidad/:id Obtiene una unidad
* @apiGroup Unidad
* @apiParam {number} id de unidad
* @apiSuccess {Object} obejto Unidad
*/
api.get('/unidad/:id', unidad.get);

/**
* @api {post} /unidad crea una unidad nueva
*
* @apiGroup Unidad
* @apiParam {Object} objeto de tipo Unidad en body
* @apiSuccess {number} id de la unidad creada
*/
permisos.add('/unidad/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/unidad/', autentication.isAuth, unidad.create);

/**
* @api {post} /unidad actuliza la informacion basica de una unidad
*  nombre, telefono, hora_apetura, hora_cierre, imagen, palabras_clave, descripcion
* @apiGroup Unidad
* @apiParam {Object} objeto de tipo Unidad en body
* @apiSuccess {number} id de la unidad creada
*/
permisos.add('/unidad/', 'PUT', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.put('/unidad/', autentication.isAuth, unidad.updateInfoBasic);

/**
* @api {post} /unidad-producto agrega productos a la unidad
*
* @apiGroup Unidad
* @apiParam {Number[][]} id_unidad, id_producto
* @apiSuccess {Object} success
*/
permisos.add('/unidad-producto/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/unidad-producto/', autentication.isAuth, unidad.addProducto);

/**
* @api {get} /unidad-producto obtiene todos los productos en una unidad
*
* @apiGroup Unidad
* @apiParam {Number} id_unidad in query 
* @apiSuccess {Object[]} lista de productos
*/
api.get('/unidad-producto/', unidad.getProductos);

/**
* @api {post} /unidad-posicion agrega o actuliza la posicion de la unidad
*
* @apiGroup Unidad
* @apiParam {number} id_unidad en query
* @apiParam {Object} {lat, lng} en body
* @apiSuccess {Object} success
*/
permisos.add('/unidad-posicion/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/unidad-posicion/', autentication.isAuth, unidad.addPosition);

/**
* @api {post} /unidad-poligono agrega o actuliza el poligono de reparto
*
* @apiGroup Unidad
* @apiParam {number} id_unidad en query
* @apiParam {Object[]} [{lat, lng}...] posiciones en body
* @apiSuccess {Object} success
*/
permisos.add('/unidad-poligono/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/unidad-poligono/', autentication.isAuth, unidad.addPolygon);

/**
* @api {get} /unidad-poligono obtiene el poligono de la unidad
*
* @apiGroup Unidad
* @apiParam {number} id_unidad en query
* @apiSuccess {Object} success
*/
api.get('/unidad-poligono/', unidad.getPoligono);

/**
* @api {post} /unidad-operador agrega operadores a unidad
*
* @apiGroup Unidad
* @apiParam {Number[][]} id_unidad, id_operador
* @apiSuccess {Boolean} success
*/
permisos.add('/unidad-operador/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/unidad-operador/', autentication.isAuth, unidad.addOperador);

/**
* @api {get} /unidad-operador obtiene todos los operadores en una unidad
*
* @apiGroup Unidad
* @apiParam {Number} id_unidad
* @apiSuccess {Object[]} lista de operadores
*/
permisos.add('/unidad-operador/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/unidad-operador/', autentication.isAuth, unidad.getLOperadoresUnidad);

/**
* @api {delete} /unidad elimina unidad
*
* @apiGroup Unidad
* @apiParam {number} id_unidad de uniad por query
* @apiSuccess {Object} success
*/
permisos.add('/unidad/', 'DELETE', [permisos.CLIENTE])
api.delete('/unidad/', autentication.isAuth, unidad.deleteR);

/**
* @api {post} /operador crea un operador
*
* @apiGroup Operador
* @apiParam {Object} Operador
* @apiSuccess {Boolean} success
*/
permisos.add('/operador/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/operador/', autentication.isAuth, operador.create);

/**
* @api {get} /operador obitiene operadores por unidad
*
* @apiGroup Operador
* @apiParam {Number} id_unidad
* @apiSuccess {Boolean} success
*/
// api.get('/operador/', operador.getLista);

/**
* @api {post} /login-operador logue operador
*
* @apiGroup Operador
* @apiParam {string} correo_electronico
* @apiParam {string} password
* @apiSuccess {Operador} success
*/
api.post('/login-operador/', operador.login);


/**
* @{get} /cliente obtiene cliente por id de cliente
*
* @api {get} /cliente/:id
* @apiGroup Cliente
* @apiParam {number} id identificado unico de cliente
* @apiSuccess {Object} obejto de tipo Cliente
*/
permisos.add('/cliente/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/cliente/:id', autentication.isAuth, cliente.get);

/**
* @api {get} /cliente obtiene liste de clientes
* @apiGroup Cliente
* @apiSuccess {Object[]} arrya de tipo Cliente
* @apiSuccessExample Success-Response:
*/
permisos.add('/cliente/', 'GET', [permisos.ADMINISTRADOR])
api.get('/cliente/', autentication.isAuth, cliente.getLista);

/**
* @api {post} /cliente/ Crea un nuevo cliente
* @apiGroup Cliente
* @apiParam {Object} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*   {id: id }
*/
permisos.add('/cliente/', 'POST', [permisos.ADMINISTRADOR])
api.post('/cliente', autentication.isAuth, cliente.create);

/**
* @api {post} /cliente-login/ loguea cliente
* @apiGroup Cliente
* @apiParam {String} - correo_electronico
* @apiParam {String} - password
* @apiSuccess {Number} id de objeto Cliente
*
*/
api.post('/login-cliente/', cliente.login);

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
* Administrador
*/
/**
* @api {post} /login-admin/
* @apiGroup usuario
* @apiParam {string} correo_electronico
* @apiParam {string} password
* @apiSuccess {Usuario} obejto de tipo Usuario
*/
api.post('/login-admin/', usuario.login_admin);

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
api.post('/usuario/', usuario.create);

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
permisos.add('/categoria/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/categoria/', autentication.isAuth, categoria.create);

/**
* @api {delete} /categoria/ elimina categoria por id
* @apiGroup Categoria
* @apiParam {Number} id de la categoria
* @apiSuccess {Boolean}
*/
permisos.add('/categoria/', 'DELETE', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.delete('/categoria/', autentication.isAuth, categoria.deleteR);

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
* @api {post} /producto/ Crea un producto
* @apiGroup producto
* @apiParam {Producto} objeto de tipo Producto
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
permisos.add('/producto/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/producto/', autentication.isAuth, producto.create);

/**
* @api {get} /producto/ filtra categorias por id de categoria
* @apiGroup producto
* @apiParam {number} id identificador de categoria
* @apiSuccess {array} array de productos
*/
api.get('/producto', producto.getLista);

/**
* @api {delete} /producto/ elimina producto por id
* @apiGroup producto
* @apiParam {number} id identificador de producto
* @apiSuccess {Boolean} respuesta
*/
permisos.add('/producto-cliente/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/producto-cliente', autentication.isAuth, producto.getListaCliente);

/**
* @api {delete} /producto/ elimina producto por id
* @apiGroup producto
* @apiParam {number} id identificador de producto
* @apiSuccess {Boolean} respuesta
*/
permisos.add('/producto/', 'DELETE', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.delete('/producto', autentication.isAuth, producto.deleteR);


/**
* @api {post} /pedido/ Crea un pedido
* @apiGroup pedido
* @apiParam {Pedido} objeto de tipo Pedido
* @apiSuccess {number} numero de pedido
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
permisos.add('/pedido/', 'POST', [permisos.USUSARIO])
api.post('/pedido/', autentication.isAuth, pedido.create);

/**
* @api {put} /pedido/ actuliza estatus pedido
* @apiGroup pedido
* @apiParam {number} id_pedido
* @apiParam {number} estatus
* @apiSuccess {Boolean} success
*/
permisos.add('/pedido-estatus/', 'DELETE', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.put('/pedido-estatus/', autentication.isAuth, pedido.setEstatus);

/**
* @api {put} /pedido-repartidor/ asigna un pedio a un repartidor
* @apiGroup producto
* @apiParam {number} id_pedido
* @apiSuccess {number} id_repartidor
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
permisos.add('/pedido-repartidor/', 'PUT', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.put('/pedido-repartidor', autentication.isAuth, pedido.asignarRepartidor);

/**
* @api {put} /pedido/ Crea un pedido
* @apiGroup producto
* @apiParam {number} id_pedido
* @apiSuccess {number} calificacion
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
permisos.add('/pedido-calificacion/', 'PUT', [permisos.USUSARIO])
api.put('/pedido-calificacion', autentication.isAuth, pedido.calificar);

/**
* @api {get} /pedido/ obtiene lista de pedidos
* @apiGroup pedido
* @apiParam {number} id_cliente
* @apiParam {number} id_unidad
* @apiSuccess {Object[]} lista de pedidos
*/
api.get('/pedido', pedido.getListaPorUnidad);

/**
* @api {get} /operador-repartidor obitene los pedidos asignados a un repartidor
*
* @apiGroup pedido
* @apiParam {Number} id_repartidor
* @apiSuccess {Pedido[]}
*/
permisos.add('/pedido-calificacion/', 'GET', [permisos.REPARTIDOR])
api.get('/pedido-repartidor/', autentication.isAuth, pedido.getListaPorRepartidor);

/**
* @api {get} /pedido/ obtiene lista de pedidos por usuario
* @apiGroup pedido
* @apiParam {number} id_usuario
* @apiSuccess {Object[]} lista de pedidos
*/
permisos.add('/pedido-usuario/', 'GET', [permisos.USUSARIO])
api.get('/pedido-usuario/',autentication.isAuth, pedido.getListaPorUsuario);

/**
* @api {get} /signed-request-image/ 
* @apiGroup image
* @apiSuccess {}
*/
permisos.add('/signed-request-image/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/signed-request-image/', autentication.isAuth, imagen.getUrlUploadImage);

/**
* @api {get} /image/ obtiene lista de imagenes en base a cliente
* @apiGroup image
* @apiSuccess {Image[]}
*/
permisos.add('/image/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/image/', autentication.isAuth, imagen.getImageListCliente);


api.post('/test', function (req, res) {
  console.log(req.body)
  return res.status(200).send({message: "success"})
})


module.exports = api;

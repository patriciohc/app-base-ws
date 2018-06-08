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
const notification = require('./controllers/push-notification');
const payments = require('./controllers/payments');
const categoriaUnidad = require('./controllers/categoria-unidad');

const permisos = require('./permisos');



api.post('/create-payment/', payments.create);
api.post('/execute-payment/', payments.onAuthorize);

/**
* @api {post} /subscribe suscribe al un usuario a las notificaciones 
* @apiGroup Notification
* @apiParam {string} id_device
* @apiSuccess {number} 
*/
permisos.add('/subscribe/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD, permisos.ADMIN_UNIDAD, permisos.ADMIN_CLIENTE, permisos.USUSARIO])
api.post('/subscribe/', autentication.isAuth, notification.suscribe);

/**
* @api {get} /unidad-cliente/ obitiene unidad por cliente
* @apiGroup Unidad
* @apiParam {number} id_cliente identificador unico de cliente
* @apiSuccess {Object} obejto de tipo unidad
*/
api.get('/unidad-cliente/', unidad.getListaCliente);

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
api.get('/unidad/', unidad.findUnidades);

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
* @apiParam {Number} id_unidad in query , obligatorio
* @apiParam {Number} texto in query texto de busqueda, opcional
* @apiParam {Number} categoria in query cateogira de los productos, opcional
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
* @api {get} /unidad-operador obtiene todos los operadores en una unidad
*
* @apiGroup Unidad
* @apiParam {Number} id_unidad
* @apiSuccess {Object[]} lista de operadores
*/
// permisos.add('/unidad-operador/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
// api.get('/unidad-operador/', autentication.isAuth, unidad.getListOperadoresUnidad);

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
* @api {post} /clienten-operador/ agrega operadores a un cliente
*
* @apiGroup Cliente
* @apiParam {number} id_unidad 
* @apiParam {number} id_clienten 
* @apiParam {String} correo_electronico - email operador 
* @apiParam {number} rol - rol del operador 
* @apiSuccess {Object} success
*/
permisos.add('/clienten-operador/', 'POST', [permisos.CLIENTE, permisos.ADMIN_UNIDAD, permisos.ADMIN_CLIENTE ])
api.post('/clienten-operador/', autentication.isAuth, cliente.addOperador);

/**
* @api {put} /clienten-operador/ actuliza 
*
* @apiGroup Cliente
* @apiParam {number} id_operador query
* @apiParam {number} rol - rol 
* @apiParam {number} id_unidad - id_unidad 
* @apiSuccess {Object} success
*/
permisos.add('/clienten-operador/', 'PUT', [permisos.CLIENTE, permisos.ADMIN_UNIDAD, permisos.ADMIN_CLIENTE ])
api.put('/clienten-operador/', autentication.isAuth, cliente.updateOperador);

/**
* @api {get} /operador obitiene operadores por cliente
*
* @apiGroup Operador
* @apiParam {Number} id_cliente
* @apiSuccess {} success
*/
permisos.add('/clienten-operador/', 'GET', [permisos.CLIENTE, permisos.ADMIN_UNIDAD, permisos.ADMIN_CLIENTE ])
api.get('/clienten-operador/', autentication.isAuth, cliente.getListOperadores);


/**
* @api {delte} /clienten-operador/ elimina operador de cliente
*
* @apiGroup Unidad
* @apiParam {number} id_unidad 
* @apiParam {number} id_clienten 
* @apiParam {String} correo_electronico - email operador 
* @apiParam {number} rol - rol del operador 
* @apiSuccess {Object} success
*/
permisos.add('/clienten-operador/', 'DELETE', [permisos.CLIENTE])
api.delete('/clienten-operador/', autentication.isAuth, cliente.deleteOperador);

/**
* @api {post} /operador/ crea un operador
*
* @apiGroup Operador
* @apiParam {Object} Operador
* @apiSuccess {Boolean} success
*/
api.post('/operador/', operador.create);

/**
* @api {post} /list-unidad-operador/ obtiene la lista de unidades a la que esta asignado el operador
*
* @apiGroup Operador
* @apiSuccess {Boolean} success
*/
permisos.add('/list-unidad-operador/', 'GET', [permisos.CLIENTE, permisos.ADMIN_UNIDAD, permisos.ADMIN_CLIENTE, permisos.OPERADOR_UNIDAD, permisos.REPARTIDOR])
api.get('/list-unidad-operador/', autentication.isAuth, operador.getListUnidades);



/**
* @api {get} /operador obitiene los roles que puede tener un operador
*
* @apiGroup Operador
* @apiSuccess {Array} success
*/
api.get('/roles/', operador.getRoles);

/**
* @api {get} /operador obitiene operadores por unidad
*
* @apiGroup Operador
* @apiParam {Number} id_unidad
* @apiSuccess {} success
*/
// api.get('/operador/:id', operador.getLista);

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
* @api {post} /login-unidad-operador genera un nuevo token para llamar ws 
*
* @apiGroup Operador
* @apiParam {string} id_sucursal
* @apiSuccess {Operador} success
*/
permisos.add('/login-unidad-operador/', 'GET', [permisos.CLIENTE, permisos.ADMIN_UNIDAD, permisos.ADMIN_CLIENTE, permisos.OPERADOR_UNIDAD, permisos.REPARTIDOR, permisos.SIN_ROL])
api.get('/login-unidad-operador/', autentication.isAuth, operador.siginUnidad);

/**
* @api {post} /login-repartidor genera un nuevo token para llamar ws 
*
* @apiGroup Operador
* @apiParam {string} correo_electronico
* @apiParam {string} password
* @apiSuccess {Operador} success
*/
api.post('/login-repartidor/', operador.loginRepartidor);


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
* @apiSuccess {Usuario} obejto de tipo usuario
*/
api.post('/login/', usuario.login);

/**
* @api {post} /login-facebook/
* @apiGroup usuario
* @apiParam {string} token token de facebook
* @apiSuccess {Usuario} obejto de tipo usuario
*/
api.post('/login-facebook/', usuario.loginFacebook);

/**
* @api {post} /login-google/
* @apiGroup usuario
* @apiParam {string} token token de facebook
* @apiParam {string} id id de facebook
* @apiSuccess {Usuario} obejto de tipo usuario
*/
api.post('/login-google/', usuario.loginGoogle);

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
*/
permisos.add('/categoria/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/categoria/', autentication.isAuth, categoria.create);

/**
* @api {post} /categoria/ actualiza una categoria
* @apiGroup Categoria
* @apiParam {Categoria} objeto de tipo categoria
* @apiParam {id} identificador de categoria
* @apiSuccess {number}
*/
permisos.add('/categoria/', 'PUT', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.put('/categoria/', autentication.isAuth, categoria.update);

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
// api.get('/categoria', categoria.getListaPorUnidad);

/**
* @api {get} /categoria/ filtra categorias, parametros por query
* @apiGroup Categoria
* @apiParam {number} id_unidad identificador de unidad por query 
* @apiParam {number} id_cliente identificador de cliente
* @apiSuccess {array} array de categorias
*/
api.get('/categoria/', categoria.getLista);


/**
* @api {post} /categoria-unidad/ Crea una categoria para unidad
* @apiGroup Categoria unidad
* @apiParam {Object} objeto categoria {nombre: string, descripcion: string}
* @apiSuccess {number} id de objeto insertado
*/
permisos.add('/categoria-unidad/', 'POST', [permisos.ADMINISTRADOR])
api.post('/categoria-unidad/', autentication.isAuth, categoriaUnidad.create);

/**
* @api {post} /categoria-unidad/ consulta lista de categorias
* @apiGroup Categoria unidad
* @apiSuccess {Array}
*/
api.get('/categoria-unidad/', categoriaUnidad.getList);

/**
* @api {post} /producto/ Crea un producto
* @apiGroup producto
* @apiParam {Producto} objeto de tipo Producto
* @apiSuccess {number} id de objeto insertado
*/
permisos.add('/producto/', 'POST', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.post('/producto/', autentication.isAuth, producto.create);

/**
* @api {put} /producto/ actualiza producto
* @apiGroup producto
* @apiParam {Producto} objeto de tipo Producto
* @apiParam {number} id de objeto
*/
permisos.add('/producto/', 'PUT', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.put('/producto/', autentication.isAuth, producto.update);

/**
* @api {get} /producto/ filtra categorias por id de categoria
* @apiGroup producto
* @apiParam {number} id identificador de categoria
* @apiSuccess {array} array de productos
*/
api.get('/producto', producto.getLista);

/**
* @api {get} /producto/ detalle de producto para consulta de clientes
* @apiGroup producto
* @apiParam {number} id identificador
* @apiSuccess {Producto} array de productos
*/
permisos.add('/producto-detalle/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/producto-detalle/', autentication.isAuth, producto.getDetalle);

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
* @api {post} /pedido/ elimina pedido
* @apiGroup pedido
* @apiParam {number} id identificador de pedido
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
permisos.add('/pedido/', 'DELETE', [permisos.USUSARIO])
api.delete('/pedido/', autentication.isAuth, pedido.deleteR);

/**
* @api {put} /pedido/ actuliza estatus pedido
* @apiGroup pedido
* @apiParam {number} id_pedido
* @apiParam {number} estatus
* @apiSuccess {Boolean} success
*/
permisos.add('/pedido-estatus/', 'PUT', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD, permisos.REPARTIDOR])
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
permisos.add('/pedido/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD])
api.get('/pedido/',  autentication.isAuth, pedido.getListaPorUnidad);

/**
* @api {get} /pedido-grafica-semana/ obtiene informacion para grafica por semana
* @apiGroup pedido
* @apiParam {number} id_unidad
* @apiSuccess {Object} lista de pedidos
*/
permisos.add('/pedido-grafica-semana/', 'GET', [permisos.CLIENTE, permisos.OPERADOR_UNIDAD, permisos.ADMIN_CLIENTE, permisos.ADMIN_UNIDAD])
api.get('/pedido-grafica-semana/',  autentication.isAuth, pedido.getNPedidosXWeek);

/**
* @api {get} /operador-repartidor obitene los pedidos asignados a un repartidor
*
* @apiGroup pedido
* @apiParam {Number} id_repartidor
* @apiSuccess {Pedido[]}
*/
permisos.add('/pedido-repartidor/', 'GET', [permisos.REPARTIDOR])
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

/**
* @api {get} /suscribe-notification/ notificaciones para usaurio especificos
* @apiGroup suscribe-notification
* @apiSuccess {Image[]}
*/
permisos.add('/suscribe-notification/', 'POST', [permisos.USUSARIO])
api.post('/suscribe-notification/', autentication.isAuth, notification.suscribe);


api.post('/test', function (req, res) {
  console.log(req.body)
  return res.status(200).send({message: "success"})
})


module.exports = api;

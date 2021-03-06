'use strict'

const express = require('express');
const api = express.Router();
const unidad = require('../controllers/unidad');
const usuario = require('../controllers/usuario');
const pedido = require('../controllers/pedido');
const operador = require('../controllers/operador');
const notification = require('../controllers/push-notification');
const payments = require('../controllers/payments');
const categoriaUnidad = require('../controllers/categoria-unidad');
const Administrador = require('../controllers/administrador');
const autentication =  require('../middleware/autentication');
const rol = require('../config/roles');


api.post('/create-payment/', payments.create);
api.post('/execute-payment/', payments.onAuthorize);

/**
* @api {get} /unidad-cliente/ obitiene unidad por cliente
* @apiGroup Unidad
* @apiParam {number} id_cliente identificador unico de cliente
* @apiSuccess {Object} obejto de tipo unidad
*/
// api.get('/unidad-cliente/', unidad.getListaCliente);

/**
* @api {get} /unidad/ Obtitene lista de unidades de un cliente (informacion general)
*
* @apiName GetUnidad
* @apiGroup Unidad
*
* @apiSuccess {Unidad[]} lista de objetos unidad
*/
// rol.add('/unidad-cliente/', 'GET', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
// api.get('/unidad-cliente/', unidad.getListaCliente);

/**
* @api {post} /unidad-posicion agrega o actuliza la posicion de la unidad
*
* @apiGroup Unidad
* @apiParam {number} id_unidad en query
* @apiParam {Object} {lat, lng} en body
* @apiSuccess {Object} success
*/
// rol.add('/unidad-posicion/', 'POST', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.post(
    '/unidad-posicion/', 
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]), 
    unidad.addPosition
);

/**
* @api {post} /unidad-poligono agrega o actuliza el poligono de reparto
*
* @apiGroup Unidad
* @apiParam {number} id_unidad en query
* @apiParam {Object[]} [{lat, lng}...] posiciones en body
* @apiSuccess {Object} success
*/
// rol.add('/unidad-poligono/', 'POST', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.post(
    '/unidad-poligono/', 
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    unidad.addPolygon
);

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
// rol.add('/unidad-operador/', 'GET', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
// api.get('/unidad-operador/', autentication.isAuth, unidad.getListOperadoresUnidad);

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
// rol.add('/clienten-operador/', 'POST', [rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE ])
// api.post('/clienten-operador/', autentication.isAuth, cliente.addOperador);

/**
* @api {put} /clienten-operador/ actuliza 
*
* @apiGroup Cliente
* @apiParam {number} id_operador query
* @apiParam {number} rol - rol 
* @apiParam {number} id_unidad - id_unidad 
* @apiSuccess {Object} success
*/
// rol.add('/clienten-operador/', 'PUT', [rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE ])
// api.put('/clienten-operador/', autentication.isAuth, cliente.updateOperador);

/**
* @api {get} /operador obitiene operadores por cliente
*
* @apiGroup Operador
* @apiParam {Number} id_cliente
* @apiSuccess {} success
*/
// rol.add('/clienten-operador/', 'GET', [rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE ])
// api.get('/clienten-operador/', autentication.isAuth, cliente.getListOperadores);


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
// api.delete(
//     '/clienten-operador/', 
//     autentication.isAuth([rol.CLIENTE]), 
//     cliente.deleteOperador);

/**
* @api {post} /list-unidad-operador/ obtiene la lista de unidades a la que esta asignado el operador
*
* @apiGroup Operador
* @apiSuccess {Boolean} success
*/
// rol.add('/list-unidad-operador/', 'GET', [rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE, rol.OPERADOR_UNIDAD, rol.REPARTIDOR])
api.get(
    '/list-unidad-operador/', 
    autentication.isAuth([rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE, rol.OPERADOR_UNIDAD, rol.REPARTIDOR]),
    operador.getListUnidades
);



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
// rol.add('/login-unidad-operador/', 'GET', [rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE, rol.OPERADOR_UNIDAD, rol.REPARTIDOR, rol.SIN_ROL])
// api.get(
//     '/login-unidad-operador/',
//     autentication.isAuth([rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE, rol.OPERADOR_UNIDAD, rol.REPARTIDOR, rol.SIN_ROL]),
//     operador.siginUnidad
// );

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
// rol.add('/cliente/', 'GET', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
// api.get(
//     '/cliente/:id', 
//     autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]), 
//     cliente.get);

/**
* @api {get} /cliente obtiene liste de clientes
* @apiGroup Cliente
* @apiSuccess {Object[]} arrya de tipo Cliente
* @apiSuccessExample Success-Response:
*/
// rol.add('/cliente/', 'GET', [rol.ADMINISTRADOR])
// api.get(
//     '/cliente/',
//     autentication.isAuth([rol.ADMINISTRADOR]),
//     cliente.getLista
// );

/**
* @api {post} /cliente-login/ loguea cliente
* @apiGroup Cliente
* @apiParam {String} - correo_electronico
* @apiParam {String} - password
* @apiSuccess {Number} id de objeto Cliente
*
*/
// api.post('/login-cliente/', cliente.login);

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
* @api {post} /profile/
* @apiGroup usuario
* @apiParam {string} token token de facebook
* @apiParam {string} id id de facebook
* @apiSuccess {Usuario} obejto de tipo usuario
*/
// rol.add('/profile/', 'GET', [rol.USUSARIO]);
api.get(
    '/profile/',
    autentication.isAuth([rol.USUSARIO]),
    usuario.getProfile
);

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
api.post('/login-admin/', Administrador.login);

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
* @api {post} /categoria-unidad/ Crea una categoria para unidad
* @apiGroup Categoria unidad
* @apiParam {Object} objeto categoria {nombre: string, descripcion: string}
* @apiSuccess {number} id de objeto insertado
*/
api.post(
    '/categoria-unidad/', 
    autentication.isAuth([rol.ADMINISTRADOR]), 
    categoriaUnidad.create
);

/**
* @api {post} /categoria-unidad/ consulta lista de categorias
* @apiGroup Categoria unidad
* @apiSuccess {Array}
*/
api.get('/categoria-unidad/', categoriaUnidad.getList);

/**
* @api {put} /pedido/ actuliza estatus pedido
* @apiGroup pedido
* @apiParam {number} id_pedido
* @apiParam {number} estatus
* @apiSuccess {Boolean} success
*/
api.put(
    '/pedido-estatus/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD, rol.REPARTIDOR]),
    pedido.setEstatus
);

/**
* @api {put} /pedido-repartidor/ asigna un pedio a un repartidor
* @apiGroup producto
* @apiParam {number} id_pedido
* @apiSuccess {number} id_repartidor
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.put(
    '/pedido-repartidor/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    pedido.asignarRepartidor
);

/**
* @api {put} /pedido/ califica un pedido
* @apiGroup unidad
* @apiParam {number} id_pedido
* @apiSuccess {number} calificacion
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.put(
    '/unidad-calificacion/',
    autentication.isAuth([rol.USUSARIO]),
    unidad.calificar
);


/**
* @api {put} /unidad/ califica un pedido
* @apiGroup unidad
* @apiParam {number} id_unidad
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.get('/unidad-calificacion/', unidad.getCalificacion);

/**
* @api {put} /unidad/ califica un pedido
* @apiGroup unidad
* @apiParam {number} id_unidad
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     id
*/
api.get('/unidad-comentarios/', unidad.getComentarios);

/**
* @api {get} /pedido-grafica-semana/ obtiene informacion para grafica por semana
* @apiGroup pedido
* @apiParam {number} id_unidad
* @apiSuccess {Object} lista de pedidos
*/
api.get(
    '/pedido-grafica-semana/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD, rol.ADMIN_CLIENTE, rol.ADMIN_UNIDAD]),
    pedido.getNPedidosXWeek
);

/**
* @api {get} /operador-repartidor obitene los pedidos asignados a un repartidor
*
* @apiGroup pedido
* @apiParam {Number} id_repartidor
* @apiSuccess {Pedido[]}
*/
api.get(
    '/pedido-repartidor/',
    autentication.isAuth([rol.REPARTIDOR]),
    pedido.getListaPorRepartidor
);

/**
* @api {get} /pedido/ obtiene lista de pedidos por usuario
* @apiGroup pedido
* @apiParam {number} id_usuario
* @apiSuccess {Object[]} lista de pedidos
*/
api.get(
    '/pedido-usuario/',
    autentication.isAuth([rol.USUSARIO]),
    pedido.getListaPorUsuario
);

/**
* @api {post} /subscribe suscribe al un usuario a las notificaciones 
* @apiGroup Notification
* @apiParam {string} id_device
* @apiSuccess {number} 
*/
api.post(
    '/subscribe/', 
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE, rol.USUSARIO]), 
    notification.subscribe
);

/**
* @api {get} /suscribe-notification/ notificaciones para usaurio especificos
* @apiGroup suscribe-notification
* @apiSuccess {Image[]}
*/
api.post(
    '/send-notification/',
    autentication.isAuth([rol.CLIENTE]),
    notification.sendPushAllUserApp
);


module.exports = api;

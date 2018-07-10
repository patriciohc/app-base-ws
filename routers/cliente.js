'use strict'

const express       = require('express');
const api           = express.Router();
const cliente       = require('../controllers/cliente');
const operador      = require('../controllers/operador');
const unidad        = require('../controllers/unidad');
const autentication = require('../middleware/autentication');
const rol           = require('../config/roles');

/*
* path /cliente
*/


/**
* @api {get} /unidad/ obitiene las unidades de un cliente cliente
* @apiGroup cliente
* @apiParam {number} id_cliente identificador unico de cliente
* @apiSuccess {Object} obejto de tipo unidad
*/
api.get('/unidad/', unidad.getList);

/**
* @api {post} /operador/ agrega operadores a un cliente
*
* @apiGroup Cliente
* @apiParam {number} id_unidad 
* @apiParam {number} id_clienten 
* @apiParam {String} correo_electronico - email operador 
* @apiParam {number} rol - rol del operador 
* @apiSuccess {Object} success
*/
api.post(
    '/operador/', 
    autentication.isAuth([rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE ]),
    cliente.addOperador
);

/**
* @api {put} /operador/ actuliza relacion operador unidad 
*
* @apiGroup Cliente
* @apiParam {number} id_operador query
* @apiParam {number} rol - rol 
* @apiParam {number} id_unidad - id_unidad 
* @apiSuccess {Object} success
*/
api.put(
    '/operador/', 
    autentication.isAuth([rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE ]), 
    cliente.updateOperador
);

/**
* @api {get} /operador/ obitiene operadores por cliente
* @apiGroup Operador
* @apiParam {Number} id_cliente
* @apiSuccess {} success
*/
api.get(
    '/operador/', 
    autentication.isAuth([rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE ]), 
    cliente.getListOperadores
);


/**
* @api {delte} /operador/ elimina operador de cliente
*
* @apiGroup Unidad
* @apiParam {number} id_unidad 
* @apiParam {number} id_clienten
* @apiParam {String} correo_electronico - email operador 
* @apiParam {number} rol - rol del operador 
* @apiSuccess {Object} success
*/
api.delete(
    '/operador/', 
    autentication.isAuth([rol.CLIENTE]), 
    cliente.deleteOperador
);




/**
* @api {post} /login logueo clientes y operadores
*
* @apiGroup Operador
* @apiParam {string} correo_electronico
* @apiParam {string} password
* @apiSuccess {Operador} success
*/
api.post('/login/', cliente.login);






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
api.get(
    '/login-unidad-operador/',
    autentication.isAuth([rol.CLIENTE, rol.ADMIN_UNIDAD, rol.ADMIN_CLIENTE, rol.OPERADOR_UNIDAD, rol.REPARTIDOR, rol.SIN_ROL]),
    operador.siginUnidad
);


/**
* @{get} /cliente obtiene cliente por id de cliente
*
* @api {get} /cliente/:id
* @apiGroup Cliente
* @apiParam {number} id identificado unico de cliente
* @apiSuccess {Object} obejto de tipo Cliente
*/
api.get(
    '/:id',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    cliente.get
);

/**
* @api {get} /cliente obtiene lista de clientes
* @apiGroup Cliente
* @apiSuccess {Object[]} arrya de tipo Cliente
* @apiSuccessExample Success-Response:
*/
api.get(
    '/',
    autentication.isAuth([rol.ADMINISTRADOR]),
    cliente.getLista
);

/**
* @api {post} /cliente/ Crea un nuevo cliente
* @apiGroup Cliente
* @apiParam {Object} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*   {id: id }
*/
api.post(
    '/',
    autentication.isAuth([rol.ADMINISTRADOR]),
    cliente.create);

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
* @api {delete} /producto/ elimina producto por id
* @apiGroup producto
* @apiParam {number} id identificador de producto
* @apiSuccess {Boolean} respuesta
*/
// api.get(
//     '/producto-cliente', 
//     autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]), 
//     producto.getListaCliente
// );


module.exports = api;

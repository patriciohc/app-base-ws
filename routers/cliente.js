'use strict'
const express       = require('express');
const api           = express.Router();
const rol           = require('../config/roles');
const autentication = require('../middleware/autentication');
// controllers
const cliente       = require('../controllers/cliente');
const operador      = require('../controllers/operador');
const unidad        = require('../controllers/unidad');
const imagen        = require('../controllers/imagen');
const producto        = require('../controllers/producto');

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
* @api {post} /login logueo clientes y operadores
*
* @apiGroup Operador
* @apiParam {string} correo_electronico
* @apiParam {string} password
* @apiSuccess {Operador} success
*/
api.post(
    '/profile/', 
    autentication.isAuth([rol.CLIENTE, rol.ADMIN_CLIENTE, rol.ADMIN_UNIDAD, rol.OPERADOR_UNIDAD, rol.SIN_ROL]),
    function (req, res) {
        if (req.rol === rol.ADMIN_CLIENTE || req.rol === rol.ADMIN_UNIDAD || req.rol === rol.OPERADOR_UNIDAD || req.rol === rol.SIN_ROL) {
          return operador.getProfile(req, res);
        } else if (req.rol == rol.CLIENTE) {
          return cliente.getProfile(req, res);
        } else {
          return res.status(404).send({code: "ERROR", message: "rol no valido"})
        }
    }
);

/**
* @api {delete} /cliente/producto/ obtiene los productos que pertenecen a un cliente
* @apiGroup cliente
* @apiSuccess {Object}
*/
api.get(
    '/producto', 
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    producto.getListaCliente
);

/**
* @api {get} /image/ obtiene lista de imagenes en base a cliente
* @apiGroup image
* @apiSuccess {Image[]}
*/
api.get(
  '/image/',
  autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
  imagen.getImageListCliente
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
  cliente.create
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

//api.put('/cliente', controllers.updateCliente);

module.exports = api;

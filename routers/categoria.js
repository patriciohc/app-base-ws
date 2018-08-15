'use strict'

const express       = require('express');
const api           = express.Router();
const categoria     = require('../controllers/categoria');
const autentication =  require('../middleware/autentication');
const rol           = require('../config/roles');

/*
* path /categoria/
*/


/**
* @api {post} /categoria/ Crea una categoria
* @apiGroup Categoria
* @apiParam {Cliente} objeto de tipo cliente
* @apiSuccess {number} id de objeto insertado
*/
// rol.add('/categoria/', 'POST', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.post(
    '/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    categoria.create
);

/**
* @api {post} /categoria/ actualiza una categoria
* @apiGroup Categoria
* @apiParam {Categoria} objeto de tipo categoria
* @apiParam {id} identificador de categoria
* @apiSuccess {number}
*/
// rol.add('/categoria/', 'PUT', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.put(
    '/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    categoria.update
);

/**
* @api {delete} /categoria/ elimina categoria por id
* @apiGroup Categoria
* @apiParam {Number} id de la categoria
* @apiSuccess {Boolean}
*/
// rol.add('/categoria/', 'DELETE', [rol.CLIENTE, rol.OPERADOR_UNIDAD])
api.delete(
    '/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    categoria.deleteR
);

/**
* @api {get} /categoria/ filtra categorias, parametros por query
* @apiGroup Categoria
* @apiParam {number} id_unidad identificador de unidad por query 
* @apiParam {number} id_cliente identificador de cliente
* @apiSuccess {array} array de categorias
*/
api.get('/', categoria.getLista);

/**
* @api {get} /categoria/ obtiene una categoria 
* @apiGroup Categoria
* @apiParam {number} id
* @apiSuccess {array}  categoria
*/
api.get('/:id', categoria.get);

module.exports = api;
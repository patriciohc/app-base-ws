'use strict'
const express       = require('express');
const api           = express.Router();
const rol           = require('../config/roles');
const autentication = require('../middleware/autentication');

const imagen = require('../controllers/imagen');

/*
* path /image
*/

/**
* @api {get} /signed-request-image/ obtiene url de S3 para subir imagen desde front
* @apiGroup image
* @apiSuccess {}
*/
api.post(
    '/info/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    imagen.saveInfoImage);

/**
* @api {get} /signed-request/ obtiene url de S3 para subir imagen desde front
* @apiGroup image
* @apiSuccess {}
*/
api.get(
    '/signed-request/',
    autentication.isAuth([rol.CLIENTE, rol.OPERADOR_UNIDAD]),
    imagen.getUrlUploadImage);

module.exports = api;
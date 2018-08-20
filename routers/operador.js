'use strict'
const express       = require('express');
const api           = express.Router();
const ROLES         = require('../config/roles');
const autentication = require('../middleware/autentication');

const Operador = require('../controllers/operador');

/*
* path /operador
*/

/**
* @api {post} /operador/ crea un operador
*
* @apiGroup Operador
* @apiParam {Object} Operador
* @apiSuccess {Boolean} success
*/
api.post('/', Operador.create);

/**
* @api {post} /operador/password-recovery/
* crea un token para recuperar reestablecer la contraseña
*
* @apiGroup Operador
* @apiParam {string} correo_electronico - por body
* @apiSuccess {Boolean} success
*/
api.post('/password-recovery/', Operador.passwordRecovery);

/**
* @api {post} /operador/password-recovery/
* reestablece la contraseña
*
* @apiGroup Operador
* @apiParam {string} password - por body
* @apiSuccess {Boolean} success
*/
api.put('/password-reset/', autentication.isAuth(['password_recovery']), Operador.passwordReset);

module.exports = api;
'use strict'

const express = require('express');
const api = express.Router();
const controllers = require('./controllers');
//const middleware = require('../middleware');

// user
api.get('/usuario/', controllers.getListaUsuarios);
api.get('/usuario/:id', controllers.getUsuario);
api.post('/usuario/', controllers.crearUsaurio);
api.post('/usuario/:id', controllers.actualizarUsaurio);
// unidad
api.get('/unidad', controllers.getGames);
api.post('/unidad', controllers.createGame);
api.put('/unidad', controllers.exitUser);

module.exports = api;

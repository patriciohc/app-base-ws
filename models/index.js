'use strict'

var cliente = require('../models/cliente');
var unidad = require('../models/unidad');
var usuario = require('../models/usuario');
var poligono = require('../models/poligono');

cliente.sync()
.then(function (result) {
    return unidad.sync();
})
.then(function (result) {
    return usuario.sync();
})
.then(function (result) {
    return poligono.sync();
})
.then(function (result) {
    return unidad.addRelation('unidad', 'id_cliente', 'cliente');
})
.catch(function (err) {
    console.log(err);
})

module.exports = {
    cliente,
    unidad,
    usuario,
    poligono
}

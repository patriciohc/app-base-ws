'use strict'

var cliente = require('../models/cliente');
var unidad = require('../models/unidad');
var usuario = require('../models/usuario');
var poligono = require('../models/poligono');
var categoria = require('../models/categoria');
var producto = require('../models/producto');

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
    return categoria.sync();
})
.then(function (result) {
    return producto.sync();
})
// foreing keys
.then(function (result) {
    return unidad.addRelation('unidad', 'id_cliente', 'cliente');
})
.then(function (result) {
    return categoria.addRelation('categoria', 'id_unidad', 'unidad');
})
.then(function (result) {
    return producto.addRelation('producto', 'id_unidad', 'unidad');
})
.then(function (result) {
    return producto.addRelation('producto', 'id_categoria', 'categoria');
})

.catch(function (err) {
    console.log(err);
})

module.exports = {
    cliente,
    unidad,
    usuario,
    poligono,
    categoria,
    producto,
}

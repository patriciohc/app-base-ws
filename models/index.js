'use strict'

var cliente = require('../models/cliente');
var unidad = require('../models/unidad');
var usuario = require('../models/usuario');
var poligono = require('../models/poligono');
var categoria = require('../models/categoria');
var producto = require('../models/producto');
var direccionSolicitud = require('../models/direccion_solicitud');
var listaPedido = require('../models/lista_pedido');
var operadorEntrega = require('../models/operador_entrega');
var pedido = require('../models/operador_entrega');

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
.then(function (result) {
    return direccionSolicitud.sync();
})
.then(function (result) {
    return listaPedido.sync();
})
.then(function (result) {
    return operadorEntrega.sync();
})
.then(function (result) {
    return pedido.sync();
})
// foreing keys - tableSrc, fieldSrc, tableRef
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
    return direccionSolicitud.addRelation('direccion_solicitud', 'id_usuario', 'usuario');
})
.then(function (result) {
    return operadorEntrega.addRelation('operador_entrega', 'id_unidad', 'unidad');
})
.then(function (result) {
    return pedido.addRelation('pedido', 'id_direccion_solicitud', 'direccion_solicitud');
})
.then(function (result) {
    return pedido.addRelation('pedido', 'id_operador_entrega', 'operador_entrega');
})
.then(function (result) {
    return listaPedido.addRelation('lista_pedido', 'id_pedido', 'pedido');
})
.then(function (result) {
    return listaPedido.addRelation('lista_pedido', 'id_producto', 'producto');
})
// errors
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
    direccionSolicitud,
    listaPedido,
    operadorEntrega,
    pedido,
}

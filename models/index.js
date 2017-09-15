'use strict'

var cliente = require('../models/cliente');
var unidad = require('../models/unidad');
var usuario = require('../models/usuario');
var poligono = require('../models/poligono');
var categoria = require('../models/categoria');
var producto = require('../models/producto');
var direccionSolicitud = require('../models/direccion-solicitud');
var listaPedido = require('../models/lista-pedido');
var operadorEntrega = require('../models/operador-entrega');
var pedido = require('../models/pedido');
var unidadProducto = require('../models/unidad-producto');

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
.then(function (result) {
    return unidadProducto.sync();
})
.then(function (result) {
  createForeingKey();
})
// errors
.catch(function (err) {
    console.log(err);
});

// foreing keys - tableSrc, fieldSrc, tableRef

function createForeingKey () {
unidad.addRelation('unidad', 'id_cliente', 'cliente')
.then(result => console.log(result))
.catch(err => console.log(err));

direccionSolicitud.addRelation('direccion_solicitud', 'id_usuario', 'usuario')
.then(result => console.log(result))
.catch(err => console.log(err));

operadorEntrega.addRelation('operador_entrega', 'id_unidad', 'unidad')
.then(result => console.log(result))
.catch(err => console.log(err));

pedido.addRelation('pedido', 'id_direccion_solicitud', 'direccion_solicitud')
.then(result => console.log(result))
.catch(err => console.log(err));

pedido.addRelation('pedido', 'id_operador_entrega', 'operador_entrega')
.then(result => console.log(result))
.catch(err => console.log(err));

listaPedido.addRelation('lista_pedido', 'id_pedido', 'pedido')
.then(result => console.log(result))
.catch(err => console.log(err));

listaPedido.addRelation('lista_pedido', 'id_producto', 'producto')
.then(result => console.log(result))
.catch(err => console.log(err));
}

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
    unidadProducto,
}

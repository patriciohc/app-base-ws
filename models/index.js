'use strict'

var cliente = require('../models/cliente');
var unidad = require('../models/unidad');
var usuario = require('../models/usuario');
var poligono = require('../models/poligono');
var categoria = require('../models/categoria');
var producto = require('../models/producto');
var direccionSolicitud = require('../models/direccion-solicitud');
var listaPedido = require('../models/lista-pedido');
var operador = require('../models/operador');
var pedido = require('../models/pedido');
var unidadProducto = require('../models/unidad-producto');
var clienteOperador = require('../models/cliente-operador');
var imagen = require('../models/imagen');
var categoriaUnidad = require('../models/categoria-unidad');
var unidadCalificacion = require('../models/unidad-calificacion');

async function createTables () {
    try {
        await cliente.sync();
        await unidad.sync();
        await usuario.sync();
        await poligono.sync();
        await categoria.sync();
        await producto.sync();
        await direccionSolicitud.sync();
        await listaPedido.sync();
        await operador.sync();
        await pedido.sync();
        await unidadProducto.sync();
        await clienteOperador.sync();
        await imagen.sync();
        await categoriaUnidad.sync();
        await unidadCalificacion.sync();
        createForeingKey();
    } catch(err) {
        console.log(err);
    }
}

// foreing keys - tableSrc, fieldSrc, tableRef
async function createForeingKey () {
    try {
        unidad.addRelation('unidad', 'id_cliente', 'cliente');
        direccionSolicitud.addRelation('direccion_solicitud', 'id_usuario', 'usuario');
        pedido.addRelation('pedido', 'id_direccion_solicitud', 'direccion_solicitud');
        pedido.addRelation('pedido', 'id_operador_entrega', 'operador');
        pedido.addRelation('pedido', 'id_usuario', 'usuario');
        listaPedido.addRelation('lista_pedido', 'id_pedido', 'pedido');
        listaPedido.addRelation('lista_pedido', 'id_producto', 'producto');
        unidadProducto.addRelation('unidad_producto', 'id_producto', 'producto');
        unidadProducto.addRelation('unidad_producto', 'id_unidad', 'unidad');
        clienteOperador.addRelation('cliente_operador', 'id_operador', 'operador');
        clienteOperador.addRelation('cliente_operador', 'id_cliente', 'cliente');
        poligono.addRelation('poligono', 'id_unidad', 'unidad');
        imagen.addRelation('image', 'id_cliente', 'cliente');
        categoria.addRelation('categoria', 'id_cliente', 'cliente');
    } catch (err) {
        console.log(err);
    }
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
    operador,
    pedido,
    unidadProducto,
    clienteOperador,
    imagen,
    categoriaUnidad,
    createTables,
    unidadCalificacion
}

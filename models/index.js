'use strict'

var cliente             = require('../models/cliente');
var unidad              = require('../models/unidad');
var usuario             = require('../models/usuario');
var poligono            = require('../models/poligono');
var categoria           = require('../models/categoria');
var producto            = require('../models/producto');
var direccionSolicitud  = require('../models/direccion-solicitud');
var listaPedido         = require('../models/lista-pedido');
var operador            = require('../models/operador');
var pedido              = require('../models/pedido');
var unidadProducto      = require('../models/unidad-producto');
var clienteOperador     = require('../models/cliente-operador');
var imagen              = require('../models/imagen');
var categoriaUnidad     = require('../models/categoria-unidad');
var unidadCalificacion  = require('../models/unidad-calificacion');
var Venta               = require('../models/venta-en-sitio');
var ProductosVenta      = require('../models/productos-venta-sitio');

async function createTables () {
    try {
        await cliente.createTable();
        await unidad.sync();
        await usuario.sync();
        await poligono.sync();
        await categoria.createTable();
        await producto.createTable();
        await direccionSolicitud.createTable();
        await listaPedido.createTable();
        await operador.sync();
        await pedido.sync();
        await unidadProducto.sync();
        await clienteOperador.createTable();
        await imagen.createTable();
        await categoriaUnidad.createTable();
        await unidadCalificacion.sync();
        await Venta.createTable();
        await ProductosVenta.createTable();
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
        // Venta.addRelation();
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

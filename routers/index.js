var cliente     = require('./cliente'),
    pedido      = require('./pedido'),
    categoria   = require('./categoria'),
    image       = require('./image'),
    producto    = require('./producto'),
    operador    = require('./operador'),
    unidad      = require('./unidad'),
    venta       = require('./venta'),
    all         = require('./routers');

module.exports = function(app) {
    app.use('/api/cliente', cliente);
    app.use('/api/pedido', pedido);
    app.use('/api/categoria', categoria);
    app.use('/api/image', image);
    app.use('/api/producto', producto);
    app.use('/api/operador', operador);
    app.use('/api/unidad', unidad);
    app.use('/api/venta', venta);
    app.use('/api', all);
}

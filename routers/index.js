var cliente     = require('./cliente'),
    pedido      = require('./pedido'),
    categoria   = require('./categoria'),
    all         = require('./routers');

module.exports = function(app) {
    app.use('/api/cliente', cliente);
    app.use('/api/pedido', pedido);
    app.use('/api/categoria', categoria);
    app.use('/api', all);
}

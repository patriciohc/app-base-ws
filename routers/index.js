var cliente = require('./cliente'),
    all     = require('./routers');

module.exports = function(app) {
    app.use('/api/cliente', cliente);
    app.use('/api', all);
}

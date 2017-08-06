'use strict'

var cliente = require('../models/cliente');
var unidad = require('../models/unidad');

cliente.sync()
.then(function (result) {
    return unidad.sync();
})
.then(function (result) {
    unidad.addRelation('unidad', 'id_cliente', 'cliente');
})
.catch(function (err) {
    console.log(err);
})

module.exports = {
    cliente,
    unidad
}

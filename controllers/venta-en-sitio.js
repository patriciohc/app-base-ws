'use strict'

const Venta = require('../models/venta-en-sitio');

function create(req, res) {
    const { venta, productos } =  req.body;
    
}

module.exports = {
    create,
}

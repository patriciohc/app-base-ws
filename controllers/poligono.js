'use strict'

const poligono = require('../models').poligono;

function update(req, res) {
    poligono.deletePoligono(req.body.id_unidad)
    .then(function(result) {
        return poligono.create(req.body.kml);
    })
    .then(function(result) {
        return res.status(200).send({});
    })
    .catch(function(err) {
        return res.status(500).send({err});
    });
}

module.exports = {
    update,
}

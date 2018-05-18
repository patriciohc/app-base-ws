'use strict'

const unidad = require('../models').unidad;
const poligono = require('../models').poligono;
const unidadProducto = require('../models').unidadProducto;
const clienteOperador = require('../models').clienteOperador;
const operador = require('../models').operador;
const utils = require('./utils');
const permisos = require('../permisos');

function get(req, res) {
    unidad.findById(req.params.id)
    .then(function(result) {
        if (!result) {
            return res.status(404).send({err: "not found"});
        } else {
            return res.status(200).send(result);
        }
    })
    .catch(function(err) {
        return res.status(500).send({err});
    });
}

/**
* localiza las unidades que se encutran dentro del rango de entrega
* de la latitud y longitud recibida
* @param {float} lat - latitud
* @param {float} lng - longitud
* @return {array} array de uidaddes
*/
function localizarUnidades (req, res) {
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    var distancia = 0.25;
    unidad.findPorDistancia(lat, lng, distancia)  // optimiza busqueda reduciendo el numero de unidades
    .then(function (result) {
        var unidadesDisponibles = [];
        var arrayPromises = [];
        for (var i = 0; i < result.length; i++) {
            arrayPromises.push(poligono.isInsade(lat, lng, result[i], unidadesDisponibles));
        }
        Promise.all(arrayPromises)
        .then(function () {
            return res.status(200).send(unidadesDisponibles);
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).send(err);
        });
    })
    .catch(function (err) {
        console.log(err);
        return res.status(500).send(err);
    });
}

function localizarUnidadesPoligonos(req,  res, promises) {

}

function getLista(req, res) {
    var key = req.query.key;
    var lng = req.query.lng;
    var lat = req.query.lat;
    if (key) {
        unidad.findAll({where: {prefix: key}})
        .then(function(result) {
            return res.status(200).send(result);
        })
        .catch(function(err) {
            return res.status(500).send({err: err});
        })
    } else if (lng && lat) {
        unidad.findAll()
        .then(function(result) {
            return res.status(200).send(result);
        })
        .catch(function(err){
            return res.status(500).send({err: err});
        })
    } else {
        return res.status(400).send({code:"ERROR", message: "Faltan parametros"});
    }
}

function getListaCliente(req, res) {
    if (!req.query.id_cliente) {
        return res.status(200).send("se requiere id de usuario")
    }
    unidad.findAll({
        select: ['id', 'nombre', 'direccion', 'telefono', 'hora_apetura', 'hora_cierre', 'descripcion'],
        where: {id_cliente: req.query.id_cliente}
    })
    .then(function(result) {
        return res.status(200).send(result);
    })
    .catch(function(err){
        return res.status(500).send({err: err});
    })
}

function create(req, res) {
    var u = req.body, idUnidad;
    u.id_cliente = req.usuario;
    unidad.create(u)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function updateInfoBasic(req, res) {
    var infoUnidad = req.body
    var idUnidad = req.query.id_unidad
    var idCliente = req.usuario;
    unidad.update(idUnidad, idCliente, infoUnidad)
    .then(function(result) {
        return res.status(200).send({code: 'OK', message:"success", affected: result.affectedRows});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function addPosition(req, res) {
    var idUnidad = req.query.id_unidad;
    var idCliente = req.usuario;
    if (!idUnidad || !idCliente) return res.status(400).send({message: 'falta id_unidad en query o id en token'})
    var pos = req.body;
    if (!pos.lat || !pos.lng)  return res.status(400).send({message: 'falta lat o lng'})
    unidad.addPosition(idUnidad, idCliente, pos)
    .then(resutl => {
        return res.status(200).send({message: "succes"});
    })
    .catch(err => {
        return res.status(500).send({message: err});
    })
}

function addPolygon(req, res) {
    var idUnidad = req.query.id_unidad;
    var idCliente = req.usuario;
    if (!idUnidad || !idCliente) return res.status(400).send({message: 'falta id_unidad en query o id en token'})
    var polygon = req.body;
    if (!polygon || !polygon.length)  return res.status(400).send({message: 'falta poligono'})
    poligono.update(idUnidad, polygon)
    .then(resutl => {
        return res.status(200).send({code: 'OK', message: "succes"});
    })
    .catch(err => {
        return res.status(500).send({message: err});
    })  
}

function getPoligono (req, res) {
    var idUnidad = req.query.id_unidad;
    if (!idUnidad) return res.status(400).send({message: 'falta id_unidad en query'})
    poligono.findOne(idUnidad)
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(err => {
        return res.status(500).send({message: err});
    })   
}

function deleteR(req, res) {
    var idUnidad = req.query.id_unidad;
    var idUsuario = req.usuario;
    unidad.deleteR(idUnidad, idUsuario)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        console.log(err);
    })
}

function addProducto(req, res) {
    unidadProducto.insertBulk("id_unidad, id_producto",req.body)
    .then(result => {
        return res.status(200).send({success: true});
    })
    .catch(err => {
        return res.status(500).send({err: err});
    });
}

// function getLOperadoresUnidad(req, res) {
//     var id_usuario = req.usuario;
//     var rol = req.rol;
//     if (rol == permisos.CLIENTE) {
//         unidadOperador.findAllOperadores(req.query.id_unidad)
//         .then(result => {
//             return res.status(200).send(result);
//         })
//         .catch(err => {
//             return res.status(500).send({err});
//         });
//     }
// }

function getProductos(req, res) {
  if (!req.query.id_unidad) {
      return res.status(400).send({err: "se require id_unidad"});
  }
  unidadProducto.findAllProductos(req.query.id_unidad)
  .then(result => {
      return res.status(200).send(result);
  })
  .catch(err => {
      return res.status(500).send({err});
  });
}

module.exports = {
    get,
    localizarUnidades,
    create,
    updateInfoBasic,
    getLista,
    addProducto,
    deleteR,
    getProductos,
    // getLOperadoresUnidad,
    getListaCliente,
    addPosition,
    addPolygon,
    getPoligono
}

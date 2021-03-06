'use strict'

const Unidad        = require('../models').unidad;
const poligono      = require('../models').poligono;
const Pedido        = require('../models/').pedido;
const unidadProducto        = require('../models').unidadProducto;
const UnidadCalificacion    = require('../models/').unidadCalificacion;

function get(req, res) {
    Unidad.findById(req.params.id)
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
* localiza las unidades que se encutran dentro de un perimetro 
* 
* de la latitud y longitud recibida
* @param {float} lat - latitud
* @param {float} lng - longitud
* @param {string} search - parametro de busqueda
* @return {array} array de uidaddes
*/
// function localizarUnidades (req, res) {
//     var lat = parseFloat(req.query.lat);
//     var lng = parseFloat(req.query.lng);
//     var search = req.query.search;
//     var categoria = req.query.categoria;
//     var distancia = 0.25;
//     unidad.find(lat, lng, distancia, {search, categoria})  // optimiza busqueda reduciendo el numero de unidades
//     .then(function (result) {
        // var unidadesDisponibles = [];
        // var arrayPromises = [];
        // for (var i = 0; i < result.length; i++) {
        //     arrayPromises.push(poligono.isInsade(lat, lng, result[i], unidadesDisponibles));
        // }
        // Promise.all(arrayPromises)
        // .then(function () {
        //     return res.status(200).send(unidadesDisponibles);
        // })
        // .catch(function (err) {
        //     console.log(err);
        //     return res.status(500).send(err);
        // });
//         return res.status(200).send(result);
//     })
//     .catch(function (err) {
//         console.log(err);
//         return res.status(500).send(err);
//     });
// }


async function findUnidades(req, res) {
    var key = req.query.key;
    var lng = req.query.lng;
    var lat = req.query.lat;
    var categoria = req.query.categoria;
    var texto = req.query.texto;
    var distancia = 2.25;
    try {
        if (key) {
            let unidad = await Unidad.findOne({where: {prefix: key}});
            return res.status(200).send({code:'SUCCESS', message: '', data: unidad});
        } else if (lng && lat) {
            let unidades = await Unidad.findByPosition(lat, lng, distancia, {texto, categoria});
            return res.status(200).send({code: "SUCCESS", message: "", list: unidades});
        } else {
            return res.status(400).send({code: "ERROR", message: "Faltan parametros"});
        }
    } catch (error) {
        return res.status(500).send({code: 'ERROR', message:'', data: err});
    }
}


async function getList(req, res) {
    if (!req.query.id_cliente) return res.status(200).send("se requiere id de usuario");
    var select = ['id', 'nombre', 'direccion', 'telefono', 'hora_apetura', 'hora_cierre', 'descripcion'];
    var where = {id_cliente: req.query.id_cliente}
    try {
        var response = await Unidad.findAll({select, where});
        return res.status(200).send({code:"SUCCESS", message:"", data: response});
    } catch(err) {
        return res.status(500).send({code: "ERROR", message: "", data: err});
    }
}

function create(req, res) {
    var u = req.body, idUnidad;
    u.id_cliente = req.usuario;
    Unidad.create(u)
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
    if (infoUnidad.categoria && infoUnidad.categoria.length) {
        infoUnidad.categoria = `{ ${infoUnidad.categoria.join(',')} }`
    } else {
        infoUnidad.categoria = '{}';
    }
    Unidad.update(idUnidad, idCliente, infoUnidad)
    .then(function(result) {
        return res.status(200).send({code: 'SUCCESS', message:"success", affected: result.affectedRows});
    })
    .catch(function(err) {
        return res.status(500).send({code: 'ERROR', message: '', data: err})
    })
}

function addPosition(req, res) {
    var idUnidad = req.query.id_unidad;
    var idCliente = req.usuario;
    if (!idUnidad || !idCliente) return res.status(400).send({message: 'falta id_unidad en query o id en token'})
    var pos = req.body;
    if (!pos.lat || !pos.lng)  return res.status(400).send({message: 'falta lat o lng'})
    Unidad.addPosition(idUnidad, idCliente, pos)
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
    Unidad.deleteR(idUnidad, idUsuario)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        console.log(err);
    })
}

async function addProducto(req, res) {
    const { all, id_unidad } = req.query;
    const { list } = req.body;
    const id_cliente = req.usuario;
    var result;
    try {
        if (all) {
            result = await unidadProducto.addAll(id_unidad, id_cliente);
            return res.status(200).send({code:'SUCCESS', message: '', data: true});            
        } else {
            result = await unidadProducto.insertBulk("id_unidad, id_producto", list);
            return res.status(200).send({code:'SUCCESS', message: '', data: true});
        }
    } catch(err) {
        return res.status(500).send({code: 'ERROR', message: '', data: err});
    }
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
    const { id_unidad, texto, categoria } = req.query
  if (!id_unidad) {
      return res.status(400).send({err: "se require id_unidad"});
  }
  var search = {}
  if (texto) search.texto = texto;
  if (categoria) search.categoria = categoria;
  unidadProducto.findAllProductos(id_unidad, search)
  .then(result => {
      return res.status(200).send({code: 'SUCCESS', message:'', data: result});
  })
  .catch(err => {
      return res.status(500).send({code: 'ERROR', message:'', data: err});
  });
}

async function calificar(req, res) {
    var id_usuario = req.usuario
    var id_unidad = req.body.id_unidad;
    var id_pedido = req.body.id_pedido;
    var calificacion = req.body.estrellas;
    var comentario = req.body.comentario;

    if (!id_unidad || !calificacion || !id_pedido || !id_usuario) 
        return res.status(404).send({code: "ERROR", message: "falta parametros"})
    var obj = {
        id_unidad,
        id_usuario,
        id_pedido,
        calificacion,
        comentario
    }
    try {
        var response = await UnidadCalificacion.create(obj);
        response = await Pedido.update(id_pedido, {calificacion: 1});
        return res.status(200).send({code: "SUCCESS", message:"", data: response});   
    } catch(err) {
        return res.status(500).send({err: err});
    }

}

async function getComentarios(req, res) {
    var id_unidad = req.query.id_unidad;

    if (!id_unidad)  return res.status(404).send({code: "ERROR", message: "falta parametros"})
    try {
        var response = await UnidadCalificacion.getComentarios(id_unidad);
        return res.status(200).send({code: "SUCCESS", message:"", data: response});   
    } catch(e) {
        return res.status(500).send({err: err});
    }
}

async function getCalificacion(req, res) {
    var id_unidad = req.query.id_unidad;

    if (!id_unidad)  return res.status(404).send({code: "ERROR", message: "falta parametros"})
    try {
        var response = await UnidadCalificacion.getCalificacion(id_unidad);
        if (response && response.length)
        return res.status(200).send({code: "SUCCESS", message:"", data: response[0]});   
    } catch(e) {
        return res.status(500).send({err: err});
    }
}

async function delProductoUnidad(req, res) {
    const { id_unidad, id_producto } = req.query;
    try {
        var result = await unidadProducto.deleteR(id_unidad, id_producto);
        return res.status(200).send({code: 'SUCCESS', message:'', data: result});
    } catch(err) {
        return res.status(500).send({code:'ERROR', message: '', data: err})
    }
}

async function updataUnidadProducto(req, res) {
    const { estatus } = req.body;
    const { id_unidad, id_producto } = req.query;
    try {
        var result = await unidadProducto.update(id_unidad, id_producto, {estatus});
        return res.status(200).send({code: 'SUCCESS', message:'', data: result});
    } catch(err) {
        return res.status(500).send({code:'ERROR', message: '', data: err})
    }
}

module.exports = {
    get,
    // localizarUnidades,
    create,
    updateInfoBasic,
    findUnidades,
    addProducto,
    deleteR,
    getProductos,
    // getLOperadoresUnidad,
    getList,
    addPosition,
    addPolygon,
    getPoligono,
    calificar,
    getCalificacion,
    getComentarios,
    delProductoUnidad,
    updataUnidadProducto
}

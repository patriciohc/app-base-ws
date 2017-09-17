'use strict'
var listaPedido = require('./lista-pedido');
var direccionSolicitud = require('./direccion-solicitud');
/*
* Pedido representa un usuario dueño de uno o varios establecimientos..
* json pedido
* {
*    id_usuario:4,
*    pedido:[ 12, 13 ],
*    direccion_entrega: {
*        lat:545,
*        lng:45,
*        referencia: "sdfds"
*    },
*    metodo_pago:{
*        tipo: 1
*    }
*    comentarios: "dfdsa"
* }
*
*/

var Model = require('./model');
// nombre de la tabla en db
const name = "pedido";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT AUTO_INCREMENT"
    }, {
        // 0: en espera de aceptacion de la tienda
        // 1: aceptado por la tienda, preparando envio
        // 2: en ruta
        // 3: entregado
        name: "estatus",
        type: "TINYINT"
    }, {
        name: "comentarios",
        type: "VARCHAR(100)"
    }, {
        name: "fecha_recibido",
        type: "DATE NOT NULL"
    }, {
        name: "hora_recibido",
        type: "TIME NOT NULL"
    }, {
        name: "calificacion",
        type: "INT"
    }, {
        name: "id_direccion_solicitud",
        type: "INT"
    }, {
        name: "id_operador_entrega",
        type: "INT"
    }, {
        name: "id_unidad",
        type: "INT NOT NULL"
    }
]

var pedido = new Model(name, columns);

function sync () {
    return pedido.createTable();
}

function create (obj) {
    return pedido.create(obj);
}

function findOne (query) {
    return pedido.findOne(query);
}

function findAll (query) {
    return pedido.findAll(query);
}

function findById (id) {
    return pedido.findById(id);
}


function getListaProductos(pedido) {
  return new Promise ((resolve, reject) => {
    listaPedido.findAllListaPedido(pedido.id)
    .then(result => {
      pedido.productos = result;
    })
    .catch(err => reject(err));
  });
}

function getDireccion(pedido) {
  return new Promise ( (resolve, reject) => {
    direccionSolicitud.findAll({where: {id: pedido.id_direccion_solicitud}})
    .then(result => {
      pedido.direccion_entrega = result;
    })
    .catch(err => reject(err))
  });
}

function findAllWithDependencies(query) {
  var promises = [];
  var lista;
  return new Promise((resolve, reject) => {
    pedido.findAll(query)
    .then(result => {
      var lista = result;
      for (let i = 0; i < lista.length; i++) {
        var pedido = lista[i];
        promises.push(getListaProductos(pedido));
        promises.push(getDireccion(pedido));
      }
      Promise.all(promises).then(() => {
        resolve(lista);
      })
      .catch(err => reject(err));
    })
    .catch(err => reject(err))
  });
}

function setEstatus(id, estatus) {
    var query = `UPDATE pedido
        SET estatus=${estatus}
        WHERE id=${id}`;
    return pedido.rawQuery(query);
}

function asignarRepartidor(id, idRepartidor) {
    var query = `UPDATE pedido
        SET id_operador_entrega=${idRepartidor}
        WHERE id=${id}`;
    return pedido.rawQuery(query);
}

function calificar(id, calificacion) {
    var query = `UPDATE pedido
        SET calificacion=${calificacion}
        WHERE id=${id}`;
    return pedido.rawQuery(query);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    setEstatus,
    asignarRepartidor,
    calificar,
    addRelation: pedido.addRelation,
    findAllWithDependencies
}

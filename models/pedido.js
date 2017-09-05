'use strict'
const DireccionSolicitud = require('./direccion_solicitud');
const ListaPedido = require('./lista_pedido');

/*
* Pedido representa un usuario dueño de uno o varios establecimientos..
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
        name: "fecha_pedido",
        type: "VARCHAR(100)"
    }, {
        name: "calificacion",
        type: "INT"
    }, {
        name: "id_direccion_solicitud",
        type: "INT"
    }, {
        name: "id_operador_entrega",
        type: "INT"
    }
]

var pedido = new Model(name, columns);

function sync () {
    return pedido.createTable();
}

function create (obj) {
    var idPedido;
    return new Promise( (resolve, reject) => {
      DireccionSolicitud.create(obj.direccion)
      .then( result => {
          console.log(result);
          var pedido = {
            estatus: 0, // en espera de aceptacion por parte de la la unidad
            comentarios: obj.comentarios,
            fecha_pedido: new Date(),
            calificacion: 0, // no ha recibido calificacion
            id_direccion_solicitud: result.insertId,
            //id_operador_entrega: // no se ha asignado repartidor
          }
          return pedido.create(obj);
      })
      .then( result => {
          var values = [];
          idPedido = result.insertId;
          for (let i = 0; i < obj.pedido.length; i++){
              values.push([idPedido, obj.pedido[i]]);
          }
          return ListaPedido.insertBulk("id_pedido, id_producto", values);
      })
      .then( result => {
          return resolve(idPedido);
      })
      .catch( err => {
          console.log(err);
          return reject(err);
      })
    })
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
}

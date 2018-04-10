'use strict'
var listaPedido = require('./lista-pedido');
var direccionSolicitud = require('./direccion-solicitud');
var usuario = require('./usuario');
var moment = require('moment');
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
        // 1: en espera de aceptacion de la tienda
        // 2: aceptado por la tienda, preparando envio
        // 3: en ruta
        // 4: entregado
        name: "estatus",
        type: "TINYINT"
    }, {
        name: "comentarios",
        type: "VARCHAR(100)"
    }, {
        name: "fecha_recibido",
        type: "DATETIME"
    }, {
        name: "calificacion",
        type: "INT"
    }, {
        name: "id_direccion_solicitud",
        type: "INT NOT NULL"
    }, {
        name: "id_operador_entrega",
        type: "INT"
    }, {
        name: "id_unidad",
        type: "INT NOT NULL"
    }, {
        name: "id_usuario",
        type: "INT NOT NULL"
    }, {
        name: "payment_id",
        type: "VARCHAR(100)"
    }, {
        name: "payer_id",
        type: "VARCHAR(100)"
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTable();
}

function create (obj) {
    return model.create(obj);
}

function findOne (query) {
    return model.findOne(query);
}

function findAll (query) {
    return model.findAll(query);
}

function findById (id) {
    return model.findById(id);
}

function update (id, obj, keyUpdate = 'id') {
    var columnsUpdate = [
        "estatus",
        "calificacion",
        "payment_id",
        "payer_id"
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
    query += ` WHERE ${keyUpdate} = '${id}'`;
    
    return model.rawQuery(query);
}

function deleteR (query) {
    return model.deleteR(query.where);
}

function getListaProductos(pedido) {
  return new Promise ((resolve, reject) => {
    listaPedido.findAllListaPedido(pedido.id)
    .then(result => {
      pedido.productos = result;
      resolve();
    })
    .catch(err => reject(err));
  });
}

function getDireccion(pedido) {
  return new Promise ( (resolve, reject) => {
    direccionSolicitud.findAll({where: {id: pedido.id_direccion_solicitud}})
    .then(result => {
      pedido.direccion_entrega = result[0];
      resolve();
    })
    .catch(err => reject(err))
  });
}

function getUsuario(pedido) {
  return new Promise ( (resolve, reject) => {
    usuario.findById(pedido.id_usuario)
    .then(result => {
      pedido.usuario = result;
      resolve();
    })
    .catch(err => reject(err))
  });
}

function findAllWithDependencies(query) {
  var promises = [];
  var lista;
  return new Promise((resolve, reject) => {
    model.findAll(query)
    .then(result => {
      var lista = result;
      for (let i = 0; i < lista.length; i++) {
        var pedido = lista[i];
        promises.push(getListaProductos(pedido));
        promises.push(getDireccion(pedido));
        promises.push(getUsuario(pedido));
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
    return model.rawQuery(query);
}

function asignarRepartidor(id, idRepartidor) {
    var query = `UPDATE pedido
        SET id_operador_entrega=${idRepartidor},
        estatus=3
        WHERE id=${id}`;
    return model.rawQuery(query);
}

function calificar(id, calificacion) {
    var query = `UPDATE pedido
        SET calificacion=${calificacion}
        WHERE id=${id}`;
    return model.rawQuery(query);
}


function getNPedidosXWeek(stringDate) {
    var date = moment(stringDate)
    var day = date.day();
    var dateInit = date.subtract(day, 'days').format('YYYY-MM-DD');
    var dateEnd = date.add((7-day), 'days').format('YYYY-MM-DD');
    var sql = `
        SELECT DAYOFWEEK(fecha_recibido) as day , count(*) as total
        FROM pedido 
        WHERE fecha_recibido BETWEEN '${dateInit}' AND '${dateEnd}'
        GROUP BY day`;
    return model.rawQuery(query);
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    update,
    setEstatus,
    asignarRepartidor,
    calificar,
    addRelation: model.addRelation,
    findAllWithDependencies,
    getNPedidosXWeek,
    deleteR
}

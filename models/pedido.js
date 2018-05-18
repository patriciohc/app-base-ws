'use strict'
var listaPedido = require('./lista-pedido');
var direccionSolicitud = require('./direccion-solicitud');
var usuario = require('./usuario');
var moment = require('moment');
var Model = require('../drive-db/model');
var types = require('../drive-db/data-types');

const engine = require('../settings').DATA_BASE.engine;

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

// nombre de la tabla en db
const name = "pedido";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "no_pedido",
        type: "VARCHAR(50)"
    }, {
        name: "consecutivo",
        type: "INT"
    }, {
        // 1: en espera de aceptacion de la tienda
        // 2: aceptado por la tienda, preparando envio
        // 3: en ruta
        // 4: entregado
        name: "estatus",
        type: types.SMALL_INT
    }, {
        name: "comentarios",
        type: "VARCHAR(100)"
    }, {
        name: "fecha_recibido",
        type: types.DATETIME
    }, {
        name: "fecha_entrega",
        type: types.DATETIME
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
    var now = moment().utc();
    obj.fecha_recibido = now.format('YYYY-MM-DD HH:mm:ss +000Z');
    if (engine == 'postgresql') {
        obj.consecutivo = {
            type: 'sql',
            value: `coalesce((SELECT MAX(consecutivo) + 1 from pedido where id_unidad = ${obj.id_unidad} and fecha_recibido::date = '${now.format('YYYY-MM-DD')}' ), 0)`
        }
        obj.no_pedido = {
            type: 'sql',
            value: `CONCAT(
                (SELECT trim(prefix) FROM unidad WHERE id = ${obj.id_unidad}) , '-',
                (SELECT TO_CHAR(NOW(), 'YYMMDD')), '-',
                coalesce((SELECT MAX(consecutivo) + 1 from pedido where id_unidad = ${obj.id_unidad} and cast(fecha_recibido as date) = '${now.format('YYYY-MM-DD')}' ), 0)
            )`
        };
    } else if (engine == 'mysql') {
        obj.consecutivo = {
            type: 'sql',
            value: `coalesce((SELECT MAX(consecutivo) + 1 from pedido where id_unidad = ${obj.id_unidad} and cast(fecha_recibido as date) = '${now.format('YYYY-MM-DD')}' ), 0)`
        }
        obj.no_pedido = {
            type: 'sql',
            value: `CONCAT(
                (SELECT trim(prefix) FROM unidad WHERE id = ${obj.id_unidad}) , '-',
                (SELECT DATE_FORMAT(NOW() ,'%y%m%d')), '-',
                coalesce((SELECT MAX(consecutivo) + 1 from pedido where id_unidad = ${obj.id_unidad} and cast(fecha_recibido as date) = '${now.format('YYYY-MM-DD')}' ), 0)
            )`
        };
    }

    return model.create(obj, {returns: 'no_pedido'});
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

async function findAllWithDependencies(query) {
  var lista = [];
  var where = model.getWhere(query.where);
  var orderBy = model.getOrderBy(query.orderBy) || '';
  var query = `SELECT pedido.id as id, pedido.no_pedido as no_pedido, pedido.estatus as estatus, comentarios, fecha_recibido, calificacion,
    usr.id as usuario_id, usr.correo_electronico as usuario_correo_electronico,  usr.nombre as usuario_nombre, usr.telefono as usuario_telefono,
    u.id as unidad_id, u.nombre as unidad_nombre, u.lat as unidad_lat, u.lng as unidad_lng,
    ds.id as ds_id, ds.nombre_direccion as ds_nombre_direccion, ds.direccion as ds_direccion, ds.lat as ds_lat, ds.lng as ds_lng, ds.referencia as ds_referencia,
    op.id as op_id, op.nombre as op_nombre, op.apellido_paterno as op_apellido_paterno
    FROM pedido
    INNER JOIN usuario usr ON usr.id = pedido.id_usuario
    INNER JOIN unidad u on u.id = pedido.id_unidad
    LEFT JOIN direccion_solicitud ds ON ds.id = pedido.id_direccion_solicitud
    LEFT JOIN  operador op ON op.id = pedido.id_operador_entrega
    WHERE ${where} ${orderBy}`;

    try {
        var response = await model.rawQuery(query);
        for (var i = 0; i < response.length; i++) {
            var record = response[i];
            var direccion_entrega = {
                id: record.ds_id,
                nombre_direccion: record.ds_nombre_direccion,
                direccion: record.ds_direccion, 
                lat: record.ds_lat, 
                lng: record.ds_lng, 
                referencia: record.ds_referencia,
            };
            var usuario = {
                id: record.usuario_id, 
                correo_electronico: record.usuario_correo_electronico,  
                nombre: record.usuario_nombre, 
                telefono: record.usuario_telefono,
            };
            var unidad = {
                id: record.unidad_id, 
                nombre: record.unidad_nombre,
                lat: record.unidad_lat,
                lng: record.unidad_lng
            };
            var operador = {
                id: record.op_id, 
                nombre: record.op_nombre,
                apellido_paterno: record.op_apellido_paterno
            };
            var productos = await listaPedido.findAllListaPedido(record.id);

            lista.push({
                id: record.id,
                no_pedido: record.no_pedido,
                estatus: record.estatus,
                comentarios: record.comentarios,
                fecha_recibido: record.fecha_recibido,
                calificacion: record.calificacion,
                direccion_entrega,
                usuario,
                unidad,
                operador,
                productos
            })
        }
        return lista
    } catch (err) {
        throw err;
    }

  return new Promise((resolve, reject) => {

    model.rawQuery(query)
    .then(result => {
      for (let i = 0; i < lista.length; i++) {
        var pedido = lista[i];
        promises.push(getListaProductos(pedido));
        //promises.push(getDireccion(pedido));
        //promises.push(getUsuario(pedido));
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

'use strict'
var moment = require('moment');
/*
* Almacena ventas en sitio
*
*/
var Model = require('../libs/drive-db/model');
var types = require('../libs/drive-db/data-types');

// nombre de la tabla en db
const name = "venta_en_sitio";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "id_cliente",
        type: "INT"
    }, {
        name: "consecutivo",
        type: "INT"
    }, {
        name: "id_unidad",
        type: "INT"
    }, {
        name: "no_tikect",
        type: "VARCHAR(200)"
    }, {
        name: "fecha",
        type: types.DATETIME
    }, {
        name: "subtotal",
        type: types.DECIMAL
    }, {
        name: "iva",
        type: types.DECIMAL
    }, {
        name: "descuento",
        type: "TIME"
    }, {
        name: "total",
        type: types.DECIMAL
    }
]

var model = new Model(name, columns);

model.create = function (obj) {
    var now = moment().utc();
    obj.fecha = now.format('YYYY-MM-DD HH:mm:ss');
    obj.fecha += '+0000'
    obj.consecutivo = {
        type: 'sql',
        value: `coalesce((SELECT MAX(consecutivo) + 1 from venta_en_sitio where id_unidad = ${obj.id_unidad} and fecha::date = '${now.format('YYYY-MM-DD')}' ), 0)`
    }
    obj.no_tikect = {
        type: 'sql',
        value: `CONCAT(
            (SELECT TO_CHAR(NOW(), 'YYMMDD')), '-',
            coalesce((SELECT MAX(consecutivo) + 1 from venta_en_sitio where id_unidad = ${obj.id_unidad} and cast(fecha as date) = '${now.format('YYYY-MM-DD')}' ), 0)
        )`
    };

    return model.coreCreate(obj, {returns: true});
}

model.update = function (value, obj, keyUpdate = 'id') {
    var columnsUpdate = [
        "subtotal",
        "iva",
        "descuento",
        "total"
    ];
    return this.coreUpdate(obj, columnsUpdate, {id: value} );
}

// async function findAllWithDependencies(query) {
//   var lista = [];
//   var where = model.getWhere(query.where);
//   var orderBy = model.getOrderBy(query.orderBy) || '';
//   var query = `SELECT pedido.id as id, pedido.no_pedido as no_pedido, pedido.estatus as estatus, comentarios, fecha_recibido,
//     usr.id as usuario_id, usr.correo_electronico as usuario_correo_electronico,  usr.nombre as usuario_nombre, usr.telefono as usuario_telefono,
//     u.id as unidad_id, u.nombre as unidad_nombre, u.lat as unidad_lat, u.lng as unidad_lng,
//     ds.id as ds_id, ds.nombre_direccion as ds_nombre_direccion, ds.direccion as ds_direccion, ds.lat as ds_lat, ds.lng as ds_lng, ds.referencia as ds_referencia,
//     op.id as op_id, op.nombre as op_nombre, op.apellido_paterno as op_apellido_paterno
//     FROM pedido
//     INNER JOIN usuario usr ON usr.id = pedido.id_usuario
//     INNER JOIN unidad u on u.id = pedido.id_unidad
//     LEFT JOIN direccion_solicitud ds ON ds.id = pedido.id_direccion_solicitud
//     LEFT JOIN  operador op ON op.id = pedido.id_operador_entrega
//     WHERE ${where} ${orderBy}`;

//     try {
//         var response = await model.rawQuery(query);
//         for (var i = 0; i < response.length; i++) {
//             var record = response[i];
//             var direccion_entrega = {
//                 id: record.ds_id,
//                 nombre_direccion: record.ds_nombre_direccion,
//                 direccion: record.ds_direccion, 
//                 lat: record.ds_lat, 
//                 lng: record.ds_lng, 
//                 referencia: record.ds_referencia,
//             };
//             var usuario = {
//                 id: record.usuario_id, 
//                 correo_electronico: record.usuario_correo_electronico,  
//                 nombre: record.usuario_nombre, 
//                 telefono: record.usuario_telefono,
//             };
//             var unidad = {
//                 id: record.unidad_id, 
//                 nombre: record.unidad_nombre,
//                 lat: record.unidad_lat,
//                 lng: record.unidad_lng
//             };
//             var operador = {
//                 id: record.op_id, 
//                 nombre: record.op_nombre,
//                 apellido_paterno: record.op_apellido_paterno
//             };
//             var productos = await listaPedido.findAllListaPedido(record.id);

//             lista.push({
//                 id: record.id,
//                 no_pedido: record.no_pedido,
//                 estatus: record.estatus,
//                 comentarios: record.comentarios,
//                 fecha_recibido: record.fecha_recibido,
//                 direccion_entrega,
//                 usuario,
//                 unidad,
//                 operador,
//                 productos
//             })
//         }
//         return lista
//     } catch (err) {
//         throw err;
//     }

//   return new Promise((resolve, reject) => {

//     model.rawQuery(query)
//     .then(result => {
//       for (let i = 0; i < lista.length; i++) {
//         var pedido = lista[i];
//         promises.push(getListaProductos(pedido));
//         //promises.push(getDireccion(pedido));
//         //promises.push(getUsuario(pedido));
//       }
//       Promise.all(promises).then(() => {
//         resolve(lista);
//       })
//       .catch(err => reject(err));
//     })
//     .catch(err => reject(err))
//   });
// }


model.getVestasByWeek = function (dateInit, dateEnd) {
    // var date = moment(stringDate)
    // var day = date.day();
    // var dateInit = date.subtract(day, 'days').format('YYYY-MM-DD');
    // var dateEnd = date.add((7-day), 'days').format('YYYY-MM-DD');
    var sql = `
        select COALESCE(sum(total), 0), to_char(fecha, 'YYYY-MM-DD') as fecha
        from venta_en_sitio 
        where fecha between '${dateInit}' and '${dateEnd}'
        group by to_char(fecha, 'YYYY-MM-DD')
        order by fecha asc`;
    return model.rawQuery(query);
}

module.exports = model;

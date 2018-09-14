'use strict'
const ListaProductos = require('../models/productos-venta-sitio');
const Venta = require('../models/venta-en-sitio');


async function getList(req, res) {
    let id_cliente = req.usuario;
    let query = req.query;
    var where = Object.assign(query, {id_cliente});
    try {
        let response = await Venta.findAllWithDependencies({where, order_by: {value: 'fecha', order: 'DESC'}});
        res.status(200).send({code: "SUCCESS", message:"", data: response});
    } catch (error) {
        res.status(500).send({code: "ERROR", message:"", data: error});
    }
}

async function get(req, res) {
    let id_cliente = req.usuario;
    let id = req.params.id;
    var where = Object.assign({id}, {id_cliente});
    try {
        let response = await Venta.findAllWithDependencies({where, order_by: {value: 'fecha', order: 'DESC'}});
        res.status(200).send({code: "SUCCESS", message:"", data: response});
    } catch (error) {
        res.status(500).send({code: "ERROR", message:"", data: error});
    }
}

async function create(req, res) {
    var jsonPedido = req.body;
    jsonPedido.id_cliente = req.usuario;
    try {
        let venta = await createPedido(jsonPedido);
        return res.status(200).send({code: 'SUCCESS', message:'', data: venta})
    } catch (error) {
        return res.status(500).send({code: 'ERROR', message: 'error', error})
    }
}

async function del(req, res) {
    const id_usuario = req.usuario;
    const { id } = req.query;
    if (!id) {
        return res.status(400).send({err: "se requiere id de pedido"})
    }
    try {
        let response = await Pedido.deleteR({where: {id, id_usuario}})
        return res.status(200).send({code:'SUCCESS', message:"", data: response});
    } catch (error) {
        return res.status(500).send({code:'ERROR', message:"", data: error});
    }
  }

async function createPedido(venta) {
    try {
        var ventaCreated = {
            id_unidad: venta.id_unidad,
            total: venta.total,
            id_cliente: venta.id_cliente
        }
        ventaCreated = await Venta.create(ventaCreated);
        var values = [];
        for (let i = 0; i < venta.productos.length; i++) {
            let p = venta.productos[i];
            values.push([ventaCreated.id, p.id_producto, p.cantidad, p.descuento, p.subtotal]);
        }
        let colums = "id_venta_en_sitio, id_producto, cantidad, descuento, total";
        let response = await ListaProductos.insertBulk(colums, values);
        
        if (response) {
            return ventaCreated;
        }
    } catch (err) {
        return err;
    }
}

async function getVestasByWeek(req, res) {
    const { fechaIni, fechaFin} = req.query;
    try {
        let response = Venta.getVestasByWeek(fechaIni, fechaFin);
        res.status(500).send({code: "SUCCESS", message:"", data: response});
    } catch(err) {
        res.status(500).send({code: "ERROR", message:"", data: error});
    }
}


module.exports = {
    getList,
    del,
    create,
    get,
    getVestasByWeek
}

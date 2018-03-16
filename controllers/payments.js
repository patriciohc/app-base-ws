const Paypal = require('paypal-rest-sdk');
const ctrlPedido = require('./pedido');
var ListaPedido = require('../models/lista-pedido');
const Pedido = require('../models/pedido');
//const producto = require('../models/producto');

Paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AZvm3p4nCWYALh4WZlpqS0GgPSpxLNDvWrbMWG2yyQQx0yoQrPAa_oGdlhxaw9zW9NC8IS0ApauiOSNS',
    'client_secret': 'EDQVxxg1IvTntYpI6WE2bl7LcIghIwbz9WwWVIHVWS15IGCT2QEbnqEQcZFKvcwoFy7ot8cBScCexLJt'
  });

function getConfigPayment(list) {
    var items = [];
    var total = 0;
    for (let i = 0; i < list.length; i++) {
        items.push({
            "name": list[i].nombre,
            "sku": "SKU",// list[i].codigo,
            "price": 1.0,// list[i].precio_publico,
            "currency": "MXN",
            "quantity": 1// list[i].cantidad         
        })
    }
    return {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": "MXN",
                "total": "2.00"
            },
            "description": "This is the payment description."
        }]
    };
}

function createPayment(json) {
    return new Promise ((resolve, reject) => {
        Paypal.payment.create(json, function (error, payment) {
            if (error) {
                return reject(error);
            } else {
                return resolve(payment);
            }
        });
    })
}

async function create(req, res) {
    try {
        if (!req.body.pedido) return res.status(401).send({code:"ERROR", message:"falta pedido"});
        var p = JSON.parse(req.body.pedido); 
        var pedido = await ctrlPedido.createPedido(p);
        var listProducts = await ListaPedido.findAllListaPedido(pedido.id);
    
        var json = getConfigPayment(listProducts);
        var newPayment = await createPayment(json);
        var response = await Pedido.update(pedido.id, {payment_id: newPayment.id}); // affectedRows
        return res.status(200).send(newPayment);
    } catch (err) {
        console.log(err);
    }

}

async function onAuthorize(req, res) {
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    try {
        var response = await Pedido.update(paymentID, {payer_id: payerID}, 'payment_id');
        return res.status(200).send({code:"SUCCESS", message: "Se guardo con exito"})
    } catch(err) {
        return res.status(500).send({code:"ERROR", message:"",  error: err});
    }
}

function execute(req, res) {
    var pedido = req.body;
    var create_payment_json = {
        payer_id: req.body.payer_id,
    }
    Paypal.payment.execute(req.body.payment_id, create_payment_json, function (error, payment) {
        if (error) {
            return res.status(500).send(error)
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            return res.status(200).send(payment)
        }
    });
}

module.exports = {
    create,
    execute,
    onAuthorize
}

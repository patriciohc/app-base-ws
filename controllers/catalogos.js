'use strict'
//var fs = require('fs');

const CATALOGOS = {
  "estatus": {
    1: "En espera de aceptación",
    2: "Aceptado por la tienda",
    3: "En ruta",
    4: "Entregado",
  }
  "roles": {
    1: "Operador de tienda",
    2: "Repartidor",
    3: "Administrador"
  }
}

function get (req, res) {
  // fs.readFile('../public/json/catalogos.json', 'utf8', function (err, data) {
  //   if (err) {
  //     return res.status(200).send({err})
  //     console.log(err)
  //   }
  //   var obj = JSON.parse(data);
  //   return res.status(200).send(obj)
  // });
  return res.status(200).send(CATALOGOS)

}

module.exports = {
    get,
}

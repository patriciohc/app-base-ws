'use strict'
var fs = require('fs');

CATALOGOS = {
  "estatus": [
    "En espera de aceptación",
    "Aceptado por la tienda",
    "En ruta",
    "Entregado",
  ]
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

'use strict'
const permisos = require('../permisos');

const ROLES = [
  {
    id: permisos.REPARTIDOR,
    nombre: 'Repartidor'
  }, {
    id: permisos.OPERADOR_UNIDAD,
    nombre: 'Operador de unidad'
  }, {
    id: permisos.ADMIN_UNIDAD,
    nombre: 'Administrador de unidad'
  }, {
    id: permisos.ADMIN_CLIENTE,
    nombre: 'Administrador'           
  }
]

const CATALOGOS = {
  "estatus": {
    1: "En espera de aceptación",
    2: "Aceptado por la tienda",
    3: "En ruta",
    4: "Entregado"
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
    ROLES
}

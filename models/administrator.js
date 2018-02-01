'use strict'
/*
* lista de administradores
*
*/

const administrators = [
    {
      id: 1,
      nombre: "Patricio Hijuitl",
      correo_electronico: "patriciohc.0@gmail.com",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    }
]

function findOne (correo_electronico) {
  return administrators.find(item => item.correo_electronico === correo_electronico)
}

module.exports = {
    findOne
}

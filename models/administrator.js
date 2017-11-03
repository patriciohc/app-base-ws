'use strict'
/*
* lista de administradores
*
*/

const administrators = [
    {
      id: 1,
      nombre: "Super Admin",
      correo_electronico: "patriciohc.0@gmail.com",
      password: "186cf774c97b60a1c106ef718d10970a6a06e06bef89553d9ae65d938a886eae",
    }
]

function findOne (correo_electronico) {
  return administrators.find(item => item.correo_electronico === correo_electronico)
}

module.exports = {
    findOne
}

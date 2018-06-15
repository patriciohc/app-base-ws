'use strict'

const admin = require('../models/administrator');

function login(req, res) {
    let user = admin.findOne(req.body.correo_electronico)
    if (!user) {
      return res.status(404).send({message: "administrador no encontrado"});
    }
    let shaPass = SHA256(req.body.password)
    if (shaPass == user.password) {
      user.token = Auth.createToken(user.id, permisos.ADMINISTRADOR)
      return res.status(200).send(user);
    } else {
      return res.status(401).send({message: "usuario no autorizado"});
    }
}

module.exports = {
    login
}

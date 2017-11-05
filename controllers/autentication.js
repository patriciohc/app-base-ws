'use strict'
const jwt = require('jsonwebtoken');
const moment = require('moment');
const settings = require('../settings');
const permisos = require('../permisos');

function createToken(id, rol) {
  var payload = {
    id: id,
    rol: rol,
    iat: moment().unix(),
    exp: moment().add(1, 'days').unix()
  }
  return jwt.sign(payload, settings.SECRET_KEY)
}

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(400).send({message: 'usuario no autorizado'})
  }
  var token = req.headers.authorization.split(' ')[1]
  try {
    var decoded = jwt.verify(token, settings.SECRET_KEY);
    if(decoded.exp <= moment().unix()) {
      return res.status(401).send({message: "El token ha expirado"});
    }
    console.log(decoded)
    if (permisos.checkPermisos(req.url, req.method, decoded.rol)) {
      req.usuario = decoded.id
      next()
      return
    } else {
      return res.status(400).send({message: 'usuario no autorizado'})
    }
  } catch(err) {
    console.log(err);
    return res.status(400).send({message: 'usuario no autorizado'})
  }
}

module.exports = {
  createToken,
  isAuth,
}

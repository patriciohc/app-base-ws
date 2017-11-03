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
  var token = req.headers.autorization.split(' ')[1]
  try {
    var decoded = jwt.verify(token, settings.SECRET_KEY);
    if(decoded.exp <= moment().unix()) {
      return res.status(401).send({message: "El token ha expirado"});
    }
    if (permisos.checkPermisos(req.url, req.method, decoded.rol)) {
      req.usuario = payload.id
      next()
    } else {
      return res.status(400).send({message: 'usuario no autorizado'})
    }
  } catch(err) {
    console.log(err);
    return res.status(400).send({message: 'usuario no autorizado'})
  }
  console.log(req.url)
  console.log(req.method)
  return res.status(200).send({message: 'se ingreso conrrectamente'})
}

module.exports = {
  createToken,
  isAuth,
}

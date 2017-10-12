'use strict'
const jwt = require('jsonwebtoken');
const moment = require('moment');
const settings = require('../settings');
//const roles

function createToken(usuario) {
  var payload = {
    id: usuario.id,
    rol: usuario.rol,
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
  } catch(err) {
    console.log(err);
    return res.status(400).send({message: 'usuario no autorizado'})
  }
  console.log(req)
  return res.status(200).send({message: 'se ingreso conrrectamente'})
}

module.exports = {
  createToken,
  isAuth,
}

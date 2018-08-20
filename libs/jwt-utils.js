'use strict'
const jwt       = require('jsonwebtoken');
const moment    = require('moment');
const config    = require('config');

module.exports = {
    // creea token jwt
    createToken (id, rol) {
        var payload = {
          id: id,
          rol: rol,
          iat: moment().unix(),
          exp: moment().add(50, 'days').unix()
        }
        return jwt.sign(payload, config.jwt.secret);
    },
    // decode jwt
    decodeToken (token) {
        return jwt.verify(token, config.jwt.secret);
    }
}


'use strict'
const jwt       = require('jsonwebtoken');
const moment    = require('moment');
const settings  = require('../settings');

module.exports = {
    // creea token jwt
    createToken (id, rol) {
        var payload = {
          id: id,
          rol: rol,
          iat: moment().unix(),
          exp: moment().add(50, 'days').unix()
        }
        return jwt.sign(payload, settings.SECRET_KEY)
    },
    // decode jwt
    decodeToken (token) {
        return jwt.verify(token, settings.SECRET_KEY);
    }

}


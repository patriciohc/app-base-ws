'use strict'
const moment    = require('moment');
// const permisos  = require('../permisos');
const jwtUtils  = require('../libs/jwt-utils');

/*
@params{Array} - roles, roles que tienen permiso a accedes a esa ruta
*/
function isAuth (roles) {
    return (req, res, next) => {
        var token = req.headers.authorization;
        if (!token) {
            return res.status(400).send({code:"ERROR", message: 'usuario no autorizado'})
        }
        try {
            var decoded = jwtUtils(token);
            if(decoded.exp <= moment().unix()) {
                return res.status(401).send({code: "ERRRO", message: "El token ha expirado"});
            }
            isAllowed = roles.find(rol => rol === decode.rol);
            if (isAllowed) {
                req.usuario = decoded.id;
                req.rol = decoded.rol;
                next();
            } else {
                return res.status(400).send({code:"ERROR", message: 'usuario no autorizado'})
            }
        } catch(err) {
            console.log(err);
            return res.status(400).send({message: 'usuario no autorizado'})
        }
    }
}

// permisos.checkPermisos(req.url, req.method, decoded.rol)

module.exports = {
    isAuth
}

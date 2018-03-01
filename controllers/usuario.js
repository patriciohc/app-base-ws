'use strict'

const usuario = require('../models').usuario;
const admin = require('../models/administrator')
const SHA256 = require("crypto-js/sha256");
const Auth = require('./autentication');
const permisos = require('../permisos');
const utils = require('./utils');
const graph = require('fbgraph');
var {OAuth2Client} = require('google-auth-library');

function getProfileFacebook(tokenFace) {
    var options = { timeout: 3000, pool: { maxSockets: Infinity }, headers: { connection: 'keep-alive' } }
    graph.setOptions(options)
    graph.setAccessToken(tokenFace)
    return new Promise((resolve, reject) => {
        graph.get('me?fields=email,name,gender,birthday', function (err, resp) {
            if (err) {
                return reject(err)
            } else {
                return resolve(resp)
            }
        });
    });
} 

async function loginFacebook(req, res) {
    var tokenFace = req.body.token;
    // var idFace = req.body.id;
    try {
        var profile = await getProfileFacebook(tokenFace);
        if (!profile.email) return res.status(400).send({code: "error", message: "falta email", error:""})
        var userdb = await usuario.findOne({where: {email: profile.email}});
        if (!userdb) {
            var newUser = {
                nombre: profile.name,
                correo_electronico: profile.email,
                // fechaNacimiento: resp.birthday,
                // sexo: resp.gender,
                type_login: 'facebook',
            };
            userdb = await usuario.create(newUser);
        }
        userdb.token = Auth.createToken(userdb.id, permisos.USUSARIO)
        return res.status(200).send(userdb);
    } catch(e) {
        console.log(e);
        return res.status(500).send({code: "error", message: "Error en el servidor" , error: e});
    }
}

function getProfileGoogle(token) {
    var CLIENT_ID = '823286805-hve74e4r5aao8s08cera30s2jbvdhtjs.apps.googleusercontent.com';
    var client = new OAuth2Client(CLIENT_ID, '', '');

    return new Promise((resolve, reject) => {
        client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            }, 
            function(err, login) {
                if (err) {
                    return reject(err);
                }
                var payload = login.getPayload();
                var userid = payload['sub'];
                // If request specified a G Suite domain:
                var domain = payload['hd'];
                resolve({
                    nombre: payload['name'],
                    email: payload['email'],
                    picture: payload['picture'],
                })
            }
        )
    });
} 

async function loginGoogle(req, res) {
    // var idFace = req.body.id;
    try {
        var profile = await getProfileGoogle(req.body.token);
        if (!profile.email) return res.status(400).send({code: "error", message: "falta email", error:""})
        var userdb = await usuario.findOne({where: {email: profile.email}});
        if (!userdb) {
            var newUser = {
                nombre: profile.name,
                correo_electronico: profile.email,
                type_login: 'google',
            };
            userdb = await usuario.create(newUser);
        }
        userdb.token = Auth.createToken(userdb.id, permisos.USUSARIO)
        return res.status(200).send(userdb);
    } catch(e) {
        console.log(e);
        return res.status(500).send({code: "error", message: "Error en el servidor" , error: e});
    }
}


function login(req, res) {
    usuario.findOne({
      select: ['id', 'correo_electronico', 'nombre', 'telefono', 'recibir_promociones', 'password'],
      where:{correo_electronico: req.body.correo_electronico}
    })
    .then(function(result) {
        console.log(result);
        if (!result) {
            return res.status(404).send({message: "not found"});
        } else {
          let shaPass = SHA256(req.body.password)
          if (shaPass == result.password) {
            delete result.password;
            result.token = Auth.createToken(result.id, permisos.USUSARIO)
            return res.status(200).send(result);
          } else {
            return res.status(401).send({message: "usuario no autorizado"});
          }
        }
    })
    .catch(function(err) {
        return res.status(500).send({err});
    });
}

function login_admin(req, res) {
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

function create(req, res) {
    let isValid = utils.andValidate(['correo_electronico', 'nombre', 'password'], req.body)
    if (!isValid) return res.status(400).send({message: 'faltan parametros'})
    usuario.create(req.body)
    .then(function(result) {
        return res.status(200).send({id: result.insertId});
    })
    .catch(function(err) {
        return res.status(500).send({err: err})
    })
}

function update(req, res) {

}

module.exports = {
    login,
    create,
    update,
    login_admin,
    loginFacebook,
    loginGoogle
}

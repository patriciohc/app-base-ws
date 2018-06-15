'use strict'

const Usuario = require('../models').usuario;
const admin = require('../models/administrator');
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
        if (!profile.email) return res.status(400).send({code: "ERROR", message: "falta email", error:""})
        var profileDB = await Usuario.login(profile.email, Usuario.LOGIN_FACEBOOK);
        if (!profileDB) {
            var newUser = {
                nombre: profile.name,
                correo_electronico: profile.email,
                // fechaNacimiento: resp.birthday,
                // sexo: resp.gender,
                type_login: Usuario.LOGIN_FACEBOOK,
            };
            var profileDB = await Usuario.create(newUser);
        }
        return res.status(200).send({code:"SUCCESS", message:"", data: profileDB});
    } catch(e) {
        console.log(e);
        return res.status(500).send({code: "ERROR", message: "Error en el servidor" , error: e});
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
        if (!profile.email) return res.status(400).send({code: "ERROR", message: "falta email", error:""})
        var profileDB = await Usuario.login(profile.email, Usuario.LOGIN_GOOGLE);
        if (!profileDB) {
            var newUser = {
                nombre: profile.name,
                correo_electronico: profile.email,
                //type_login: 'google',
            };
            var profileDB = await Usuario.create(newUser);
        }
        return res.status(200).send({code: "SUCCESS", message:"", data: profileDB});
    } catch(e) {
        console.log(e);
        return res.status(500).send({code: "ERROR", message: "Error en el servidor" , data: e});
    }
}


async function login(req, res) {
    var email = req.body.correo_electronico;
    var password = req.body.password;
    if (!email || !password) return res.status.send(404).send({code:"ERROR", message:"faltan parametros"})
    try {
        var profile = await Usuario.login(email, Usuario.LOGIN_DEFAULT, password);
        return res.status(200).send({code: "SUCCESS", message:"", data: profile})
    } catch (err) {
        return res.status(500).send({code: "ERROR", message: "", data: err});
    }
}

async function getProfile(req, res) {
    var id_usuario = req.usuario;
    if (!id_usuario) return res.status(404).send({code:"ERROR", message: "Faltan parametros"});
    try {
        var profile = await Usuario.getProfile(id_usuario);
        return res.status(200).send({code:"SUCCESS", message:"", data: profile});
    } catch (err) {
        return res.status(500).send({code:"ERROR", message:"", data: err});
    }
}

function create(req, res) {
    let isValid = utils.andValidate(['correo_electronico', 'nombre', 'password'], req.body)
    if (!isValid) return res.status(400).send({message: 'faltan parametros'})
    Usuario.create(req.body)
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
    loginFacebook,
    loginGoogle,
    getProfile
}

const usuario = require('../models').usuario;
const http = require('http');

function suscribe (req, res) {
    var id_usuario = req.usuario;
    var id_push = req.body.id_push;
    unidad.update(id_usuario, {id_push})
    .then(function(result) {
        return res.status(200).send({code: 'OK', message:"success", affected: result.affectedRows});
    })
    .catch(function(err) {
        return res.status(500).send({code: 'ERROR', message: "error", err: err})
    })
}

async function sendPushOneUser(title, message, idUser) {
    var user = usuario.findById(idUser);
    if(!user || !user.id_push) {
        console.log("usuario no tiene id_push");
        return;
    }
    var data = {
        app_id: "",
        // included_segments: [segment],
        include_player_ids: [user.id_push],
        data: {},
        headings: {en: this.utf8ToUnicode(title)},
        // ios_badgeType: 'SetTo',
        // ios_badgeCount: 0,
        // subtitle: {en: subtitle},
        contents: {en: this.utf8ToUnicode(message)}
    };
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YjMyMjMzMGMtMGUxZC00NmQwLWFhOTMtYzAwMzhmODVhOTM0"
      };
      
      var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };
      
      var req = https.request(options, function(res) {  
        res.on('data', function(data) {
          console.log("Response:");
          console.log(JSON.parse(data));
        });
      });
      
      req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
      });
      
      req.write(JSON.stringify(data));
      req.end();
      
}

module.exports = {
    suscribe,
    sendPushOneUser
}


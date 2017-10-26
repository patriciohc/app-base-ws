'use strict';
/*
* 04/08/2017
* Archivo javascript principal para la ejecución del servidor
*/
var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');

var app = express();
// websockets
var server = require("http").Server(app);
var io = require("socket.io")(server);
require('./controllers-sk/seguimiento')(io);
//const config = require('./api/config');
//var jwt = require('jwt-simple');
//process.env.PWD = process.cwd()
//app.use('/public', express.static(process.env.PWD + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const api = require('./routers');
app.use('/api', api);
/************ https ************/
// var fs = require('fs');
// var https = require('https');
// var privateKey  = fs.readFileSync(rootPath+'/https/key.key');
// var certificate = fs.readFileSync(rootPath+'/https/396b94f1a9c1d5b9.crt');
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);
app.use(express.static("./public"));
const port = process.env.PORT || 8088;
server.listen(port, () =>{
    console.log("servidor corriendo en http://localhost: " + port);
});

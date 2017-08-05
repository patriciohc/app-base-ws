'use strict';
/*
* 04/08/2017
* Archivo javascript principal para la ejecución del servidor de la aplicación.
*/
const express = require('express');
const bodyParser = require('body-parser');

var app = express();
//const config = require('./api/config');
//var jwt = require('jwt-simple');

var rootPath = __dirname;
app.use(express.static(rootPath+"/www"));

/************ https ************/
// var fs = require('fs');
// var https = require('https');
// var privateKey  = fs.readFileSync(rootPath+'/https/panda-express.key');
// var certificate = fs.readFileSync(rootPath+'/https/396b94f1a9c1d5b9.crt');
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);

//app.use(methodOverride());
// websockets
var server = require("http").Server(app);
//var io = require("socket.io")(server);
//require('./controllerWs')(io);

const api = require('./routers');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', api);


const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
server.listen(port, () =>{
    console.log("servidor corriendo en http://localhost: " + port);
});

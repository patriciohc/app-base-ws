'use strict';
/*
* 04/08/2017
* Archivo javascript principal para la ejecución del servidor de la aplicación.
*/


var express = require('express');
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

SwaggerExpress.create(configSwagger, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8080; // 443;
  // app.listen(port, function(){
  //     console.log("servidor corrienton en puerto: " + port);
  // });
  // https
  httpsServer.listen(port, function(){
      console.log("servidor corriendo en puerto: " + port);
  });

});

//module.exports = app; // for testing

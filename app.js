'use strict';
/*
* 04/08/2017
* Archivo javascript principal para la ejecución del servidor
*/

const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const app           = express();

require('./models/index').createTables();

var server = require("http").Server(app);
var io = require("socket.io")(server);

require('./controllers-sk/seguimiento')(io);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
require('./routers')(app);

/************ https ************/
// var fs = require('fs');
// var https = require('https');
// var privateKey  = fs.readFileSync(rootPath+'/https/key.key');
// var certificate = fs.readFileSync(rootPath+'/https/396b94f1a9c1d5b9.crt');
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);
app.use(express.static("./public"));
app.use('/admin-client/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('./public/admin-client/index.html', { root: __dirname });
});
const port = process.env.PORT || 8088;
server.listen(port, () =>{
    console.log("servidor corriendo en http://localhost: " + port);
});

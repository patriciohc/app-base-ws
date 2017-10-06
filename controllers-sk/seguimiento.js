'use strict'

var io;
/**
* usuario esta a la escucha de las posiciones
*/
function listenUser(msg) {
  console.log('listen: ' + msg.id_pedido)
  // verificar token
  // if (!req.id_pedido || !req.id_usuario)
  var socket = this;
  socket.join(msg.id_pedido);
}

/**
* app de repartidor envia su posicion
* se envia a la app de usaurio
*/
function receivePosition(msg) {
    var socket = this
    console.log('position: ' + msg.id_pedido)
    console.log(msg)
    // verificar token
    // if (!req.id_pedido || !req.id_usuario)
    io.to(msg.id_pedido).emit('send_position', msg.position);
}

function connect(socket) {
    console.log("web sockec conectado...");
    socket.on('listen', listenUser);
    socket.on('set_position', receivePosition)
}

module.exports = function(sockeIO) {
    io = sockeIO;
    io.on("connection", connect);
}

'use strict'
var users = {};
var io;
/**
* usuario esta a la escucha de las posiciones
*/
function listenUser(msg) {
    var socket = this
    console.log('listen: ' + msg.id_pedido)
    users[socket.id] = msg.id_pedido;
    // socket.join(socket.id);
}

function leaveRoom() {
    var socket = this;
    delete users[socket.id];
}

function onDisconnect() {
    var socket = this;
    delete users[socket.id];
}

/**
* app de repartidor envia su posicion
* se envia a la app de usaurio
*/
function receivePosition(msg) {
    var socket = this;
    var id_user;
    for (var key in users) {
        if (users[key] == msg.id_pedido) {
            id_user = key;
            break;
        }
    }
    if (!id_user) return;
    io.to(id_user).emit('send_position', msg.location);
}

function connect(socket) {
    console.log("web sockec conectado...");
    socket.on('listen', listenUser);
    socket.on('set_position', receivePosition);
    socket.on('leave_room', leaveRoom);
    socket.on('disconnect', onDisconnect);
}

module.exports = function(sockeIO) {
    io = sockeIO;
    io.on("connection", connect);
}

'use strict'

module.exports = Object.freeze({

// TABLA OPERADOR
    SIN_ROL: 0,         // se asigna a un operador antes de poder determinar su rol
    REPARTIDOR: 1,      // tiene acceso a la app de repartidor - operador
    OPERADOR_UNIDAD: 2, // tiene permisos para ver y cambiar de estatus los pedidos - operedor
    ADMIN_UNIDAD: 3,    // tiene permisos de edicion en una unidad especifica - operador
    ADMIN_CLIENTE: 4,   // tiene los mismo permisos que cliente - operador

// TABLA CLIETEN
    CLIENTE: 5,         // tiene todos los permisos - cliente

// TABLA USUARIO
    USUSARIO: 6,        // acceso a informacion de usuario - usuario

// SIN TABLA
    ADMINISTRADOR: 7    // tiene permisos para registrar nuevos clientes - administrador

});
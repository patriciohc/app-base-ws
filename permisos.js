'use strict'

// roles
// TABLA OPERADOR
const REPARTIDOR = 1 // tiene acceso a la app de repartidor - operador
const OPERADOR_UNIDAD = 2 // tiene permisos para ver y cambiar de estatus los pedidos - operedor
const ADMIN_UNIDAD = 3; // tiene permisos de edicion en una unidad especifica - operador
const ADMIN_CLIENTE = 4; // tiene los mismo permisos que cliente - operador
// TABLA CLIETEN
const CLIENTE = 5 // tiene todos los permisos - cliente
// TABLA USUARIO
const USUSARIO = 6 // acceso a informacion de usuario - usuario
// SIN TABLA
const ADMINISTRADOR = 7 // tiene permisos para registrar nuevos clientes - administrador

// permisos
var permisos = {
  [REPARTIDOR]: {},
  [OPERADOR_UNIDAD]: {},
  [CLIENTE]: {},
  [USUSARIO]: {},
  [ADMINISTRADOR]: {},
  [ADMIN_UNIDAD]: {},
  [ADMIN_CLIENTE]: {}
}

function add(url, method, roles) {
  for (let i = 0; i < roles.length; i++) {
    let rol = roles[i];
    console.log(rol)
    if (!permisos[rol][url])
      permisos[rol][url] = [method]
    else
      permisos[rol][url].push(method)
  }
}

function checkPermisos(url, method, rol) {
  if (!url) return false;
  if (url.indexOf("?") != -1) {
    url = url.split("?")[0];
  }
  var permisosRol = permisos[rol]
  if (!permisosRol) return false; // el rol no existe
  var urlPermitida = permisosRol[url]
  if (!urlPermitida) return false // la url no esta permitida
  if (urlPermitida.indexOf(method) != -1){
    return true;
  } else {
    return false; // metodo no permitido
  }
}
module.exports = {
  add,
  checkPermisos,
  REPARTIDOR,
  OPERADOR_UNIDAD,
  CLIENTE,
  USUSARIO,
  ADMINISTRADOR,
  ADMIN_UNIDAD,
  ADMIN_CLIENTE
}

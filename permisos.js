'use strict'

// 1 repartidor,
// 2 operador de unidad
// 3 administrador
// roles
const REPARTIDOR = 1
const OPERADOR_UNIDAD = 2
const CLIENTE = 3
const USUSARIO = 4
const ADMINISTRADOR = 5
// permisos
var permisos = {
  [REPARTIDOR]: {},
  [OPERADOR_UNIDAD]: {},
  [CLIENTE]: {},
  [USUSARIO]: {},
  [ADMINISTRADOR]: {}
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
}

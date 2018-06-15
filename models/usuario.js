'use strict'
/*
* Usuario que usa la app de compra
*
*/
const SHA256 = require("crypto-js/sha256");
const Model = require('../drive-db/model');
const types = require('../drive-db/data-types');
const Auth = require('../controllers/autentication');
const permisos = require('../permisos');

const LOGIN_DEFAULT = 0;
const LOGIN_FACEBOOK = 1;
const LOGIN_GOOGLE = 2;

// nombre de la tabla en db
const name = "usuario";
// columnas de valor unico
const uniques = ['correo_electronico'];
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "correo_electronico",
        type: "VARCHAR(250) NOT NULL"
    }, {
        name: "nombre",
        type: "VARCHAR(100) NOT NULL"
    }, {
        name: "password",
        type: "varchar(100) NOT NULL"
    }, {
        name: "telefono", // telefono movil
        type: "varchar(200)"
    }, {
        name: "recibir_promociones",
        type: types.SMALL_INT // 1 true, 0 false
    }, {
        name: "id_push",
        type: "VARCHAR(100)"
    }, {
        name: "type_login",
        type: "INT"  // facebook, google, defautl
    }, {
        name: "id_device",
        type: "VARCHAR(100)"
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTable();
}

async function create (obj) {
    if (obj.type_login == LOGIN_DEFAULT) {
        obj.password = SHA256(obj.password);
    }
    obj.id = await model.create(obj);
    return construirProfile(obj);
}

function findOne (query) {
    return model.findOne(query);
}

function findAll (query) {
    return model.findAll(query);
}

function findById (id) {
    return model.findById(id);
}


function update(id, obj) {
    var columnsUpdate = [
        'nombre',
        'password',
        'telefono',
        'recibir_promociones',
        'id_device'
    ];
    var query = `UPDATE ${name} SET `;
    for (let i = 0; i < columnsUpdate.length; i++) {
        if (obj[columnsUpdate[i]])
            query += `${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}', `;
    }
    query = query.substring(0, query.length -2); // se quita coma
    query += ` WHERE id = ${id}`;
    
    return usuario.rawQuery(query);
}

async function login(correo_electronico, type_login, password) {
    var query = `SELECT correo_electronico, nombre, telefono, recibir_promociones, p.calificacion, p.id as id_pedido
        FROM usuario u
        LEFT JOIN pedido p ON p.id_usuario = u.id
        WHERE u.correo_electronico = '${correo_electronico}' AND 
        type_login = ${type_login} `

    if (type_login == LOGIN_DEFAULT) {
        var shaPass = SHA256(password)
        query += `AND
            password = '${shaPass}'
            ORDER BY p.fecha_recibido desc LIMIT 1`;
    } else {
        query += `ORDER BY p.fecha_recibido desc LIMIT 1`;
    }
    try {
        var u = await model.rawQuery(query);
        if (u && u.length) {
            return construirProfile(u[0]);
        } else {
            return null;
        }
    } catch(err) {
        throw err;
    }
}

async function getProfile(id_usuario) {
    var query = `SELECT correo_electronico, nombre, telefono, recibir_promociones, p.calificacion, p.id as id_pedido
    FROM usuario u
    LEFT JOIN pedido p ON p.id_usuario = u.id
    WHERE u.id = ${id_usuario}`;
    try {
        var u = await model.rawQuery(query);
        if (u && u.length) {
            return construirProfile(u[0]);
        } else {
            return null;
        }
    } catch(err) {
        throw err;
    }
}

function construirProfile(usuario) {
    return  {
        correo_electronico: usuario.correo_electronico,
        nombre: usuario.nombre,
        telefono: usuario.telefono,
        recibir_promociones: usuario.recibir_promociones,
        token: Auth.createToken(usuario.id, permisos.USUSARIO),
        ultimo_pedido: {
            id: usuario.id_pedido,
            esta_calificado: usuario.calificacion
        }
    }
}

module.exports = {
    sync,
    create,
    findOne,
    findById,
    findAll,
    update,
    login,
    getProfile,
    LOGIN_DEFAULT,
    LOGIN_FACEBOOK,
    LOGIN_GOOGLE
}

'use strict'

const NUMBER = [
    'INT',
    'TINYINT',
]
/**
* Concatena los elemetos de un objeto model, para la creacion de la tabla
* @param {model} - objeto model, contiene los nombres de columnas y tipos
* @return {string} - string que contiene el formato para crear la tabla
*/
function concat(model) {
    var columns = ""
    for (var i = 0; i < model.length; i++) {
        columns += `${model[i].name} ${model[i].type}, `
    }
    columns = columns.substring(0, columns.length - 2);
    return columns;
}

/**
* crea el formato para insercion en la tabla
* @param {model} - modelo del objeto que se insertara
* @param {object} - objeto que se insertara
* @param {string} - nombre de la tabla donde se insertara
* @return {string} - string con el formato para insertar
*/
function getSqlInsert(object, model, table) {
    var columns = "";
    var values = "";
    for (let i = 0; i < model.length; i++) {
        var column = model[i];
        if (object[column.name]) {
            columns += `${column.name} ,`;
            var type = column.type.split(" ")[0];
            if (NUMBER.indexOf(type.toUpperCase()) != -1) {
                values += `${object[column.name]} ,`;
            } else {
                values += `'${object[column.name]}' ,`;
            }
        }
    }
    if (columns != "") {
        columns = columns.substring(0, columns.length - 2);
        values = values.substring(0, values.length - 2);
        return `INSERT INTO ${table} (${columns}) VALUES (${values})`
    } else {
        return null;
    }
}

function getSqlFind(model, query, table, limit) {
    var p = query.where;
    var and = "", sql;
    for (var i = 0; i < model.length; i++) {
        var column = model[i].name;
        if (p[column]) {
            and += `${column} = ${p[column]} AND ` ;
        }
    }
    if (and != "") {
        var where = and.substring(0, values.length - 5);
        return `SELECT * FROM ${table} ${where} limit ${limit}`;
    } else {
        return `SELECT * FROM ${table} limit ${limit}`;
    }
}

function getSqlFindAll(model, query, table) {
    var p = query.where;
    if (!p) return `SELECT * FROM ${table} limit 1000`;
    var and = "", sql;
    for (var i = 0; i < model.length; i++) {
        var column = model[i].name;
        if (p[column]) {
            and += `${column} = ${p[column]} AND ` ;
        }
    }
    if (and != "") {
        var where = and.substring(0, values.length - 5);
        return `SELECT * FROM ${table} ${where}`;
    } else {
        return `SELECT * FROM ${table} limit 1000`;
    }
}


module.exports = {
    concat,
    getSqlInsert,
    getSqlFind,
    getSqlFindAll
}

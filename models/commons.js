'use strict'

const NUMBER = [
    'INT',
    'TINYINT',
]

const COMPARATORS = {
    'eq': '=',
    'st': '<',
    'gt': '>',
    'neq':'<>'
}
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
* Concatena los elemetos de un objeto model, para la creacion de la tabla
* @param {model} - objeto model, contiene los nombres de columnas y tipos
* @return {string} - string que contiene el formato para crear la tabla
*/
function concatKeys(keys, uniques) {
    var result = ""
    if (uniques.length >= 1) {
        result = ` UNIQUE KEY(${uniques.join(',')}),`;
    }
    if (keys.length >= 1) {
        result += ` PRIMARY KEY(${keys.join(',')}) `;
    }
    return result;
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
        if (typeof(object[column.name]) != 'undefined') {
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
    var where = getWhere(query.where, model);
    var select = '*'
    if (query.select) {
      select = query.select.join(", ")
    }
    if (where != "") {
        return `SELECT ${select} FROM ${table} WHERE ${where} limit ${limit}`;
    } else {
        return `SELECT ${select} FROM ${table} limit ${limit}`;
    }
}

/**
* @param{Object} where - es un objeto de tipo {condicion1:value1, condicion2:value2 ...}
* @return{string} cadena sql
*/
function getWhere(where, model) {
    var and = [], sqlWhere;
    for (var i = 0; i < model.length; i++) {
        var column = model[i].name;
        if (where.hasOwnProperty(column)) {
            let com = typeof(where[column]) === 'undefined' ? '' : where[column];
            and.push(`${column} = '${com}'`);
        }
    }

    if (where._raw) {
        and.push(where._raw);
    }

    if (and.length > 0) {
        return  and.join(' AND ')
    } else {
        return "";
    }
}

function getSelect (select, model) {
    if (!select) return " * ";
    var selectQ = "";
    for (var i = 0; i < model.length; i++) {
        var column = model[i].name;
        if (select.indexOf(column) != -1) {
            selectQ += ` ${column}, ` ;
        }
    }
    if (selectQ != "") {
        return selectQ.substring(0, selectQ.length - 2);
    } else {
        return " * ";
    }
}

function getOrderBy (orderBy) {
    if (!orderBy || !orderBy.value) return '';
    return 'ORDER BY ' + orderBy.value + ' ' + (orderBy.order || '');
}

function getSqlFindAll(model, query, table) {
    var p = query.where;
    var select = getSelect(query.select, model);
    if (!p) return `SELECT ${select} FROM ${table} limit 1000`;
    var where = getWhere(query.where, model);
    var orderBy = getOrderBy(query.order_by)
    if (where != "") {
        return `SELECT ${select} FROM ${table} WHERE ${where} ${orderBy}`;
    } else {
        return `SELECT ${select} FROM ${table} ${orderBy} limit 1000`;
    }
}


module.exports = {
    concat,
    getSqlInsert,
    getSqlFind,
    getSqlFindAll,
    getWhere,
    concatKeys,
}

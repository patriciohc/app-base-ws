'use strict'
const format = require('pg-format');
const engine = require('../../settings').DATA_BASE.engine;

const COMPARATORS = {
    'eq': '=',
    'st': '<',
    'gt': '>',
    'neq':'!='
}
/**
* Concatena los elemetos de un objeto model, para la creacion de la tabla
* @param {model} - objeto model, contiene los nombres de columnas y tipos
* @return {string} - string que contiene el formato para crear la tabla
*/
function concat(model) {
    var columns = []
    var inc = engine == 'mysql' ? 'AUTO_INCREMENT' : 'SERIAL';
    for (var i = 0; i < model.length; i++) {
        var item = engine == 'mysql' ? createElementContactMysql(model[i]) : createElementContactPostgreSQL(model[i]);
        columns.push(item);
        //columns += `${model[i].name} ${model[i].type} ${model[i].auto_increment ? inc : ''}, `
    }
    // columns = columns.substring(0, columns.length - 2);
    return columns.join(', ')
}

function createElementContactMysql(item) {
    if (item.auto_increment) {
        return `${item.name} ${item.type.toString(item.config)} AUTO_INCREMENT `
    } else {
        return `${item.name} ${item.type.toString(item.config)} ${item.default ? ('DEFAULT ' + item.default) : ''}`
    }
}

function createElementContactPostgreSQL(item) {
    if (item.auto_increment) {
        return `${item.name} SERIAL `
    } else {
        return `${item.name} ${item.type.toString(item.config)} ${item.default ? ('DEFAULT ' + item.default) : ''}`
    }
}

/**
* Concatena los elemetos de un objeto model, para la creacion de la tabla
* @param {model} - objeto model, contiene los nombres de columnas y tipos
* @return {string} - string que contiene el formato para crear la tabla
*/
function concatKeys(keys, uniques) {
    var unique = engine == 'mysql' ? 'UNIQUE KEY' : 'UNIQUE';
    var result = ""
    if (uniques.length >= 1) {
        result = ` ${unique}(${uniques.join(',')}),`;
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
    var columns = [];
    var values = [];
    var vars = "";
    for (let i = 0; i < model.length; i++) {
        var column = model[i];
        if (typeof(object[column.name]) != 'undefined') {
            columns.push(column.name);
            // var type = column.type.toString();
            switch(typeof(object[column.name])) {
                case 'number':
                    values.push(object[column.name]);
                    break;
                case 'string':
                    values.push(`'${object[column.name]}'`);
                    break;
                case 'object':
                    if (object[column.name].type && object[column.name].value) {
                        if ((object[column.name].type == 'sql' && engine == 'postgresql') || object[column.name].type == 'number') {
                            values.push(object[column.name].value);
                        } else if (object[column.name].type == 'sql' && engine == 'mysql') {
                            values.push(object[column.name].value);
                        } else {
                            values.push(`'${object[column.name]}'`);
                        }
                    } else {
                        values.push("''");
                    }
                break;
            }
        }
    }
    if (columns.length > 0 && engine == 'mysql') {
        return `${vars} INSERT INTO ${table} (${columns.join(', ')}) SELECT ${values.join(', ')};`
    } else if (columns.length > 0 && engine == 'postgresql') {
        return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});`
    } else {
        return null;
    }
}

/**
* retorna query de busqueda
* @param{Object} model - columnas de la tabla
* @param{Object} query - es un objeto de tipo {select: {}, where: {}}
* @param{string} table - nombre de la tabla
* @param{string} limit - limite de registros, obligatorio para no enviar infomacion en exceso
* @return{string} cadena sql
*/
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
function getWhere(where, model, table) {
    var and = [];
    for (var i = 0; i < model.length; i++) {
        var column = model[i].name;
        if (!where.hasOwnProperty(column)) continue;
        var condition = where[column] == undefined ? '' : where[column];
        if (typeof(condition) == 'string' || typeof(condition) == 'number') {
            if (table) {
                and.push(`${table}.${column} = '${condition}'`);
            } else {
                and.push(`${column} = '${condition}'`);
            }
        } else {
            let op = COMPARATORS[condition.op];
            if (!op) continue;
            let com = condition.value;
            if (table) {
                and.push(`${table}.${column} ${op} '${com}'`);
            } else {
                and.push(`${column} ${op} '${com}'`);
            }
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

function getOrderBy (orderBy, table) {
    if (!orderBy || !orderBy.value) return '';
    if (table) {
        return `ORDER BY ${table}.${orderBy.value} ${(orderBy.order || '')}`;
    } else {
        return `ORDER BY ${orderBy.value} ${(orderBy.order || '')}`;
    }
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

function getSqlInsertBulk(name, columns = '', values = []) {
    if (Array.isArray(columns)) {
        columns = columns.join(', ');
    }
    var query = `INSERT INTO ${name} (${columns}) VALUES %L`;
    return format(query, values);
}


module.exports = {
    concat,
    getSqlInsert,
    getSqlFind,
    getSqlFindAll,
    getWhere,
    concatKeys,
    getOrderBy,
    getSqlInsertBulk
}

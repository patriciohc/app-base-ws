"use strict";

const config = require('../../settings').DATA_BASE;
const { Pool } = require('pg');
const mysql = require('mysql');

var isConected, conecction;

//private function
function executeMySQL(query, options) {
    if (!isConected) connect();

    return new Promise(function(resolve, reject) {
        if (options && options.values) {
            conecction.query(query, options.values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            conecction.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }

    })
}

/**
 * si recibe returns = true en opciones retoras el registro insertado
 * se puede especificar un valor de retorno si se le pasa el nombre de la columna
 * @param {string} query - sentencia sql 
 * @param {Obejct} options - {returns: [string || bolean]} 
 */
async function executePostgreSQL(query, options) {
    var response;
    if (!isConected) connect();
    query = query.trim();
    var command = query.split(" ")[0];
    if (command.toUpperCase() === 'INSERT') {
        query = query.replace(";", "");
        if (options && options.returns) {
            if (options.returns === true) {
                query = query  + ' RETURNING *;'
            } else {
                query = query  + ` RETURNING ${options.returns};`
            }   
        }
    }
    try {
        response = await conecction.query(query);
        if (response.command === 'INSERT') {
            if (response.rows.length === 1) {
                return response.rows[0];
            } else  if (response.rows.length > 1) {
                return response.rows;
            } else {
                return response;
            }
        } else {
            return response.rows;
        }
    } catch (err) {
        console.log(err);
        // throw err;
    }
}

function connect() {
    if (config.engine == 'mysql') {
        conecction = mysql.createPool({
            connectionLimit: 5,
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            dateStrings: true
        });
        isConected = true;
    } else if (config.engine == 'postgresql') {
        conecction = new Pool({
            connectionString: config.connectionString,
            ssl: true,
        });
        isConected = true;
    }
}


// public function
function execute(query, options) {
    console.log(query);
    if (config.engine == 'mysql') {
        return executeMySQL(query, options);
    } else if (config.engine == 'postgresql') {
        return executePostgreSQL(query, options);
    }
}

module.exports = {
    execute
}

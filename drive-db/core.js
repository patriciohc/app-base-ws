"use strict";

const config = require('../settings').DATA_BASE;
const mysql = require('mysql');
const { Pool } = require('pg');

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

async function executePostgreSQL(query, options) {
    if (!isConected) connect();
    query = query.trim();
    var command = query.split(" ")[0];
    if (command.toUpperCase() === 'INSERT') {
        query = query.replace(";", "");
        if (options && options.returns) {
            query = query  + ` RETURNING ${options.returns};`
        } else {
            query = query  + ' RETURNING id;'
        }
    }
    try {
        var res = await conecction.query(query);
        if (res.command === 'INSERT' && res.rows.length === 1) {
            return {insertId: res.rows[0].id};
        }
        return res.rows;
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

"use strict";

const config = require('../settings').DATA_BASE;
const mysql = require('mysql');
const { Pool } = require('pg');

var isConected, conecction;

//private function
function executeMySQL(query, values) {
    if (!isConected) connect();

    return new Promise(function(resolve, reject) {
        if (values) {
            conecction.query(query, values, (err, result) => {
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

async function executePostgreSQL(query, values) {
    if (!isConected) connect();
    try {
        var res = await conecction.query(query);
        console.log(res);
        return res.rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function connect() {
    if (config.engine == 'mysql') {
        conecction = mysql.createPool({
            connectionLimit: 5,
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
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
function execute(query, values) {
    console.log(query);
    if (config.engine == 'mysql') {
        return executeMySQL(query, values);
    } else if (config.engine == 'postgresql') {
        return executePostgreSQL(query, values);
    }
}

module.exports = {
    execute
}

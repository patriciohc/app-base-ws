"use strict";

const mysql = require('mysql');

var isConected = false;
var conecction = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database : 'base_ws',
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b93a567617aa59',
    password: '619b8316',
    database : 'heroku_e41bcc31c05226c',
});

function connect() {
    return new Promise(function(resolve, reject) {
        if (isConected) {
            resolve(conecction);
        } else {
            conecction.connect(function(err) {
                if (err) reject(err);
                console.log("Connected!");
                isConected = true;
                resolve(conecction);
            });
        }
    });
}




module.exports = {
    connect,
    conecction,
    isConected
}

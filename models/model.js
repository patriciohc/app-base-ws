'use strict'

const db = require('../conection_db');
const utils = require('./commons');

class Model {

    constructor(name, model) {
        this.name = name;
        this.model = model;
    }

    createTable (callback) {
        var self = this;
        return new Promise(function(resolve, reject){
            db.connect()
            .then(function(con) {
                var columns = utils.concat(self.model);
                var sql = `CREATE TABLE IF NOT EXISTS ${self.name} (${columns}, PRIMARY KEY(id));`;
                console.log(sql);
                con.query(sql, function (err, result) {
                    if (err) return reject(err);;
                    return resolve(result);
                });
            })
            .catch(function(err) {
                reject(err);
            });
        })
    }

    create(user) {
        var sql = utils.getSqlInsert(user, this.model, this.name);
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sql) {
                db.conecction.query(sql, function(err, result){
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(result);
                    }
                })
            } else {
                return resolve({affectedRows: 0});
            }
        });
    }

    insertBulk(columns, values) {
        var sql = `INSERT INTO ${this.name} (${columns}) VALUES ?`;
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.conecction.query(sql, [values],  function(err, result){
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            })
        });
    }

    findOne(query) {
        var sql = utils.getSqlFind(this.model, query, this.name, 1);
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sql) {
                db.conecction.query(sql, function(err, results){
                    if (err) {
                        return reject(err);
                    } else {
                        if (results.length > 0)
                            return resolve(results[0]);
                        else
                            return resolve({});
                    }
                })
            } else {
                return resolve([]);
            }
        });
    }

    findAll(query) {
        query = query || {};
        var sql = utils.getSqlFindAll(this.model, query, this.name);
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sql) {
                db.conecction.query(sql, function(err, results) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(results);
                    }
                })
            } else {
                return resolve([]);
            }
        });
    }

    findById(id) {
        var sql = `SELECT * FROM ${this.name} WHERE id = ${id};`;
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sql) {
                db.conecction.query(sql, function(err, result){
                    if (err) {
                        return reject(err);
                    } else {
                        if (result.length == 0) {
                            return resolve();
                        } else {
                            return resolve(result[0]);
                        }
                    }
                })
            } else {
                return resolve([]);
            }
        });
    }

/**
* elimina registros
*/
    deleteR (where) {
        var sqlWhere = utils.getWhere(where, this.model);
        var sql = `DELETE FROM ${this.name} WHERE ${sqlWhere};`;
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sqlWhere) {
                db.conecction.query(sql, function(err, result){
                    if (err) {
                        return reject(err);
                    } else {
                        if (result.length == 0) {
                            return resolve();
                        } else {
                            return resolve(result);
                        }
                    }
                })
            } else {
                return resolve({});
            }
        });
    }

/**
* agrega una relacion entre tablas
* @param {String} tableSrc - tabla fuente
* @param {String} fieldSrc - campo en tabla fuente
* @param {String} tableRef - tabla destino, siempre se usa campo id
*/
    addRelation(tableSrc, fieldSrc, tableRef) {
        var sql =
        `ALTER TABLE ${tableSrc}
        ADD FOREIGN KEY (${fieldSrc}) REFERENCES ${tableRef}(id);`
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.conecction.query(sql, function(err, results) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            })
        });
    }

    rawQuery(query) {
        console.log(query);
        return new Promise((resolve, reject) => {
            db.conecction.query(query, function(err, results) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            })
        });
    }

}

module.exports = Model;

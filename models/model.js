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

    findOne(query) {
        var sql = utils.getSqlFind(this.model, query, this.name, 1);
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sql) {
                db.conecction.query(sql, function(err, results){
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

    findAll(query) {
        query = query || {};
        var sql = utils.getSqlFindAll(this.model, query, this.name);
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (sql) {
                db.conecction.query(sql, function(err, results){
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

}

module.exports = Model;

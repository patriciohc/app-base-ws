'use strict'

const db = require('../conection_db');
const utils = require('./commons');

class Model {

    constructor(name, model, uniques = [], keys = ['id']) {
        this.name = name;
        this.model = model;
        this.uniques = uniques;
        this.keys = keys;
    }

    createTable () {
        var self = this;
        return new Promise(function(resolve, reject) {
            db.connect()
            .then(function(con) {
                var columns = utils.concat(self.model);
                var keys = utils.concatKeys(self.keys, self.uniques);
                var sql = `CREATE TABLE IF NOT EXISTS ${self.name} (${columns}, ${keys});`;
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

    createTableLlaveCompuesta (key1, key2) {
      this.keys = [key1, key2];
      return this.createTable();
    }

    create(obj) {
        obj = this.cleanObj(obj); 
        var sql = utils.getSqlInsert(obj, this.model, this.name);
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
        ADD CONSTRAINT fk_${tableSrc}_${fieldSrc}_${tableRef}
        FOREIGN KEY (${fieldSrc}) REFERENCES ${tableRef}(id) ON DELETE CASCADE;`
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

/**
* elimina parametros que no pertenecen a esta objeto
* @param {Object} obj - tabla fuente
* @return {Object} objeto limpio
*/    
    cleanObj(obj) {
        var objClean = {};
        for (let i = 0; i < this.model.length; i++) {
            var item = this.model[i];
            if (obj[item.name]) {
                objClean[item.name] = obj[item.name];
            }
        }
        return objClean;
    }

}

module.exports = Model;

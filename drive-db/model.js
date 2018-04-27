'use strict'

const db = require('./core');
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
        var columns = utils.concat(self.model);
        var keys = utils.concatKeys(self.keys, self.uniques);
        var sql = `CREATE TABLE IF NOT EXISTS ${self.name} (${columns}, ${keys});`;
        return db.execute(sql);
    }

    createTableLlaveCompuesta (key1, key2) {
      this.keys = [key1, key2];
      return this.createTable();
    }

    create(obj) {
        obj = this.cleanObj(obj); 
        var sql = utils.getSqlInsert(obj, this.model, this.name);
        if (sql) {
            return db.execute(sql);
        } else {
            return Promise.resolve({affectedRows: 0});
        }
    }

    insertBulk(columns, values) {
        var sql = utils.getSqlInsertBulk(this.name, columns, values);
        // var sql = `INSERT INTO ${this.name} (${columns}) VALUES ?`;
        return db.execute(sql, values);
        // return new Promise((resolve, reject) => {
        //     db.conecction.query(sql, [values],  function(err, result){
        //         if (err) {
        //             return reject(err);
        //         } else {
        //             return resolve(result);
        //         }
        //     })
        // });
    }

    async findOne(query) {
        var sql = utils.getSqlFind(this.model, query, this.name, 1);
        if (!sql) return {};
        try {
            var results = await db.execute(sql);
            return results.length > 0 ? results[0] : {};
        } catch (err) {
            throw err;
        }
        // return new Promise((resolve, reject) => {
        //     if (sql) {
        //         db.conecction.query(sql, function(err, results){
        //             if (err) {
        //                 return reject(err);
        //             } else {
        //                 if (results.length > 0)
        //                     return resolve(results[0]);
        //                 else
        //                     return resolve({});
        //             }
        //         })
        //     } else {
        //         return resolve([]);
        //     }
        // });
    }

    findAll(query) {
        query = query || {};
        var sql = utils.getSqlFindAll(this.model, query, this.name);
        if (!sql) return Promise.resolve([]);

        return db.execute(sql);

        // return new Promise((resolve, reject) => {
        //     if (sql) {
        //         db.conecction.query(sql, function(err, results) {
        //             if (err) {
        //                 return reject(err);
        //             } else {
        //                 return resolve(results);
        //             }
        //         })
        //     } else {
        //         return resolve([]);
        //     }
        // });
    }

    async findById(id) {
        var sql = `SELECT * FROM ${this.name} WHERE id = ${id};`;
        if (!sql) return {};
        try {
            var results = await db.execute(sql);
            return results.length > 0 ? results[0] : {};
        } catch (err) {
            throw err;
        }
        // return new Promise((resolve, reject) => {
        //     if (sql) {
        //         db.conecction.query(sql, function(err, result){
        //             if (err) {
        //                 return reject(err);
        //             } else {
        //                 if (result.length == 0) {
        //                     return resolve();
        //                 } else {
        //                     return resolve(result[0]);
        //                 }
        //             }
        //         })
        //     } else {
        //         return resolve([]);
        //     }
        // });
    }

/**
* elimina registros
*/
    async deleteR (where) {
        var sqlWhere = utils.getWhere(where, this.model);
        var sql = `DELETE FROM ${this.name} WHERE ${sqlWhere};`;
        if (!sql) return {};
        try {
            var results = await db.execute(sql);
            return results.length > 0 ? results[0] : {};
        } catch (err) {
            throw err;
        }

        // return new Promise((resolve, reject) => {
        //     if (sqlWhere) {
        //         db.conecction.query(sql, function(err, result){
        //             if (err) {
        //                 return reject(err);
        //             } else {
        //                 if (result.length == 0) {
        //                     return resolve();
        //                 } else {
        //                     return resolve(result);
        //                 }
        //             }
        //         })
        //     } else {
        //         return resolve({});
        //     }
        // });
    }

/**
* agrega una relacion entre tablas
* @param {String} obj - datos
* @param {String} columnsUpdate - columnas que se actulizaran
* @param {String} where - condicion
* @return {Promise}
*/
    update (obj, columnsUpdate, where) {
        var where;
        var query = `UPDATE ${this.name} SET `;
        var sets = [];
        for (let i = 0; i < columnsUpdate.length; i++) {
            if (obj[columnsUpdate[i]])
                sets.push(`${columnsUpdate[i]} = '${obj[columnsUpdate[i]]}'`);
        }
        if (sets.length == 0) return Promise.resolve('no hay datos para actualizar');
        where = utils.getWhere(where, this.model);
        if (!where) return Promise.resolve('no hay condicion para actulizar');
        query += sets.join(',');
        query += ' where ' + where;
        return db.execute(query);
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
        return db.execute(sql);

        // return new Promise((resolve, reject) => {
        //     db.conecction.query(sql, function(err, results) {
        //         if (err) {
        //             return reject(err);
        //         } else {
        //             return resolve(results);
        //         }
        //     })
        // });
    }

    rawQuery(query) {
        return db.execute(query);
        // return new Promise((resolve, reject) => {
        //     db.conecction.query(query, function(err, results) {
        //         if (err) {
        //             return reject(err);
        //         } else {
        //             return resolve(results);
        //         }
        //     })
        // });
    }

    getWhere(where) {
        return utils.getWhere(where, this.model, this.name);
    }

    getOrderBy(orderBy) {
        return utils.getOrderBy(orderBy, this.name);
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
            if (typeof(obj[item.name]) != 'undefined') {
                objClean[item.name] = obj[item.name];
            }
        }
        return objClean;
    }

}

module.exports = Model;

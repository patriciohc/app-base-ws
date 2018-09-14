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
        this.coreCreate(obj, {returns: true})
    }

    coreCreate(obj, options) {
        obj = this.cleanObj(obj); 
        var sql = utils.getSqlInsert(obj, this.model, this.name);
        if (sql) {
            return db.execute(sql, options);
        } else {
            return Promise.resolve(null);
        }
    }

    insertBulk(columns, values) {
        var sql = utils.getSqlInsertBulk(this.name, columns, values);
        return db.execute(sql, {returns: false});
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
    }

    findAll(query) {
        query = query || {};
        var sql = utils.getSqlFindAll(this.model, query, this.name);
        if (!sql) return Promise.resolve([]);

        return db.execute(sql);
    }

    async findById(id, select) {
        var sqlSelect = ''
        if (!select) {
            sqlSelect = '*'
        } else {
            var selectFilter = this.model.filter(item => select.find(a => a == item.name));
            select = selectFilter.map(item => item.name);
            sqlSelect = select.length ? select.join(', ') : 'id';
        }
        var sql = `SELECT ${sqlSelect} FROM ${this.name} WHERE id = ${id} LIMIT 1;`;
        if (!sql) return {};
        try {
            var results = await db.execute(sql);
            return results.length > 0 ? results[0] : null;
        } catch (err) {
            throw err;
        }
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
    }

/**
* 
* @param {String} obj - datos
* @param {String} columnsUpdate - columnas que se actulizaran
* @param {String} where - condicion
* @return {Promise}
*/
    coreUpdate (obj, columnsUpdate, where) {
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
    }

    rawQuery(query) {
        return db.execute(query);
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

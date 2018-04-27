const engine = require('../settings').DATA_BASE.engine;

const DECIMAL = {
    toString: function () {
        switch (engine) {
            case 'mysql': return 'DOUBLE';
            case 'postgresql': return 'DOUBLE PRECISION';
        }
    }
}

const REAL = {
    toString: function () {
        switch (engine) {
            case 'mysql': return 'FLOAT';
            case 'postgresql': return 'REAL';
        }
    },

    toMySQL: function () {
        return 'FLOAT';
    },

    toPostgreSQL: function () {
        return 'REAL';
    }
}

const SMALL_INT = {
    toString: function () {
        switch (engine) {
            case 'mysql': return 'TINYINT';
            case 'postgresql': return 'smallint';
        }
    },

    toMySQL: function () {
        return 'TINYINT';
    },

    toPostgreSQL: function () {
        return 'smallint';
    }
}

const DATETIME = {
    toString: function () {
        switch (engine) {
            case 'mysql': return 'DATETIME';
            case 'postgresql': return 'timestamp';
        }
    },

    toMySQL: function () {
        return 'DATETIME';
    },

    toPostgreSQL: function () {
        return 'timestamp';
    }
}

module.exports = {
    DECIMAL,
    REAL,
    SMALL_INT,
    DATETIME
}
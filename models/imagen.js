'use strict'
/*
* imagen
*
*/
var Model = require('../libs/drive-db/model');
// nombre de la tabla en db
const name = "image";
// columnas en db
const columns = [
    {
        name: "id",
        type: "INT",
        auto_increment: true
    }, {
        name: "id_cliente",
        type: "INT"
    }, {
        name: "url",
        type: "VARCHAR(250)"
    }, {
        name: "type_image",
        type: "VARCHAR(100)"
    }, {
        name: "label",
        type: "VARCHAR(100)"
    }
]

var model = new Model(name, columns);

function sync () {
    return model.createTable();
}

function create (obj) {
    return model.create(obj);
}

// obtiene un poligono con todas sus cordenadas
function findOne(id_unidad) {

}

function findAll (query) {
    return model.findAll(query);
}

function deleteR (idUnidad) {
    return model.deleteR({id_unidad: idUnidad});
}

module.exports = {
    sync,
    create,
    deleteR,
    findOne,
    findAll,
    addRelation: model.addRelation,
}

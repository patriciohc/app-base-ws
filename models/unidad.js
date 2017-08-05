/*
* Unidad representa un establecimiento, consultorio, local ect.
*
*/

class Unidad {
    constructor() {
        // define el nombre de las columas y tipo de datos para una db de mysql
        this.columns = [
            {
                nombre: "id",
                tipo: "int"
            }, {
                nombre: "nombre",
                tipo: "varchar(100)"
            }, {
                nombre: "estado",
                tipo: "varchar(100)"
            }, {
                nombre: "municipio",
                tipo: "varchar(100)"
            }, {
                nombre: "direccion", // colonia, calle, numero
                tipo: "varchar(200)"
            }, {
                nombre: "lat", // latitud
                tipo: "double"
            }, {
                nombre: "lng", // longitud
                tipo: "double"
            }, {
                nombre: "referencia", // referencia para encontrar establecimiento
                tipo: "varchar(200)"
            }, {
                nombre: "telefono",
                tipo: "varchar(20)"
            }, {
                nombre: "hora_apetura",
                tipo: "date"
            }, {
                nombre: "hora_cierre",
                tipo: "date"
            }, {
                nombre: "estatus",
                tipo: ""
            }
        ]
        // crear tabla si no existe
    }

}

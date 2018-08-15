const aws = require('aws-sdk');
const Imagen = require('../models').imagen;

async function getUrlUploadImage(req, res) {
    if (!req.query.type_image) return res.status(400).send({code: "ERROR", message: "falta type_image"});
    try {
        var img = await signedS3(req.usuario, req.query.type_image);
        return res.status(200).send({code: "SUCCESS", message: "", data: img});
    } catch (err) {
        console.error(err);
        return res.status(200).send({code: "ERROR", message: "Ocurrio un error al guardar imagen", data: err});
    }
}

async function saveInfoImage(req, res) {
    const { url, type_image, label } = req.body
    try {
        let obj = {id_cliente: req.usuario, url, type_image, label}
        let response = await Imagen.create(obj);
        obj.id = response.insertId;
        return res.status(200).send({code: "SUCCESS", message: "", data: obj});
    } catch (err) {
        return res.status(200).send({code: "ERROR", message: "Ocurrio un error al guardar imagen", data: err});
    }
}

async function getImageListCliente(req, res) {
    try {
        var response = await Imagen.findAll({id_cliente: req.usuario})
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({code:"ERROR", message: "", data: err})
    }
}

function signedS3(usuario, typeImage) {
    var timestamp = Date.now();
    var fileName = usuario + '-' + typeImage + '-' + timestamp + '.jpg';
    var S3_BUCKET = 'media0-delivery';
    aws.config.region = 'us-east-2';
    const s3 = new aws.S3();
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err) return reject(err);
            var url = `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
            const returnData = {
                signedRequest: data,
                url: url
            };
            return resolve(returnData);
        });
    });
}

module.exports = {
    getUrlUploadImage,
    getImageListCliente,
    saveInfoImage
}
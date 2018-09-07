const Imagen    = require('../models/imagen');
const moment    = require('moment');
const aws       = require('aws-sdk');

const S3_BUCKET = 'media0-delivery';
aws.config.region = 'us-east-2';
const s3 = new aws.S3();

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
    const { url, type_image, label, key } = req.body
    try {
        let obj = {id_cliente: req.usuario, url, type_image, label, key};
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

async function deleteImage (req, res) {
    const { id, key } = req.query;
    try {
        let response = await Imagen.deleteR({id});
        var params = {
            Bucket: S3_BUCKET, 
            Delete: { 
              Objects: [{ Key: key }]
            },
        };
        s3.deleteObjects(params, function(err, data) {
            if (err) {
                return res.status(500).send({code: 'ERROR', message: 'error al borrar en s3', data: err})
            } else {
                return res.status(200).send({code: 'SUCCESS', message: '', data: data});
            }
        });
    } catch (err) {
        return res.status(500).send({code: 'ERROR', message: 'error al borrar en db', data: err})
    }
}

function signedS3(usuario, typeImage) {
    var date = moment().format('YYYY-MM-DD');
    var timestamp = Date.now().toString();
    timestamp = timestamp.substring(4, timestamp.length);
    var key = usuario + '/' + typeImage + '-' + date + '-' + timestamp + '.jpg';
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: key,
        Expires: 60,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', s3Params, (err, signedRequest) => {
            if(err) return reject(err);
            var url = `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
            const returnData = { signedRequest, url, key};
            return resolve(returnData);
        });
    });
}

module.exports = {
    getUrlUploadImage,
    getImageListCliente,
    saveInfoImage,
    deleteImage
}
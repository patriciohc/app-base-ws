const aws = require('aws-sdk');
const imagen = require('../models').imagen;

function getUrlUploadImage(req, res) {
    var response;
    if (!req.query.type_image) return res.status(400).send({message: "falta type_image"});
    signedS3(req.usuario, req.query.type_image)
    .then(result => {
        response = result;
        return imagen.create(req.usuario, response.url, req.query.type_image)
    })
    .then(result => {
        response.id = result.insertId;
        res.status(200).send(response);
    })
}

function getImageListCliente(req, res) {
    imagen.findAll({id_cliente: req.usuario})
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(err => {
        return res.status(500).send({err})
    })
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
    getImageListCliente
}
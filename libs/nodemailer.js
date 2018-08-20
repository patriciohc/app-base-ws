'use strict';
const nodemailer    = require('nodemailer');
const config        = require('config');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
module.exports = {
    VERIFY_EAMIL: 0,
    SALE: 1,

    sendMail (type, to, data) {
        var mailOptions = {
            from: config.nodemailer.account_user, // sender address
            to: to,
            subject: data.title, // Subject line
            text: data.text, // plain text body
        };

        switch (type) {
            case this.VERIFY_EAMIL:
                mailOptions.subject = 'Gracias por resgistrarse'
                mailOptions.html = '<b>Hello world </b>' + data.url
                break;
            case this.VERIFY_EAMIL:
                break;
        }

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oauth2',
                user: config.nodemailer.account_user, // generated ethereal user
                refreshToken: 'https://mail.google.com/',
                clientId: config.nodemailer.client_id,
                clientSecret: config.nodemailer.client_secret
            }
        });

        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
    }
}
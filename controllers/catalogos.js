'use strict'
var fs = require('fs');

function get (req, res) {
  fs.readFile('../public/json/catalogos.json', 'utf8', function (err, data) {
    if (err) {
      return res.status(200).send({err})
    }
    var obj = JSON.parse(data);
    return res.status(200).send(obj);
  });
}

module.exports = {
    get,
}

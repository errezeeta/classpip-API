/* eslint-disable max-len */
/* eslint-disable strict */
var path = require('path');
var fs = require('fs');
exports.privateKey = fs.readFileSync(path.join(__dirname, '../api.key')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, '../api.crt')).toString();

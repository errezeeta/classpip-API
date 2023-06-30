/* eslint-disable max-len */
'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var http = require('http');
const https = require('https');
var sslConfig = require('./ssl');

var app = module.exports = loopback();

// boot scripts mount components like REST API
boot(app, __dirname);

function myCors(req, res, nxt) {
  res.header('Access-Control-Allow-Origin', 'https://192.168.26.96:8100');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    nxt();
  }
}

app.use(myCors);

app.start = function(httpOnly) {
  if (httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if (!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' +
app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}

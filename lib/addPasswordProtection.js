'use strict';

var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var prependFile = require('prepend-file');

module.exports = function(location, password) {
  createHtPasswd(location, password);
  modifyHtAccess(location);
}

function createHtPasswd(location, password) {
  var htpasswdData = "# This file should be located in a private place in the server\n";
  htpasswdData += "user:" + md5(password);

  fs.writeFile(path.join(location,'.htpasswd'), htpasswdData, function(err) {
    if (err) throw err;
  });
}

function modifyHtAccess(location) {
  var htaccessData = '' +
  'AuthName "Restricted Area"\n' +
  'AuthType Basic\n' +
  'AuthUserFile ' + path.join('{{htpasswd}}', '.htpasswd') + '\n'
  'Require valid-user\n\n';

  prependFile(path.join(location, '/static/.htaccess'), htaccessData, function(err) {
    if (err) throw err;
  });
}
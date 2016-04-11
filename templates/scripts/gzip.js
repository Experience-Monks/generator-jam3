'use strict';
var config = require('./config');
var glob = require('glob');
var fs = require('graceful-fs');
var path = require('path');
var zlib = require('zlib');

glob(path.join(config.output,'*.{css,js}'),function(err,files) {
  if (!err) {
    files.map(function(cur) {
      var gzip = zlib.createGzip();
      fs.createReadStream(cur).pipe(gzip).pipe(fs.createWriteStream(cur+'.gz'));
    });
  } else {
    console.log(err);
  }
});

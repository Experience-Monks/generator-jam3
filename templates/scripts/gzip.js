'use strict';
var config = require('./config');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var gzip = require('zlib').createGzip();

glob(path.join(config.output,'*.{css,js}'),function(err,files) {
  if (!err) {
    files.map(function(cur) {
      fs.createReadStream(cur).pipe(gzip).pipe(fs.createWriteStream(cur+'.gz'));
    });
  } else {
    console.log(err);
  }
});

'use strict';
var path = require('path');
var config = require('./config');
var budo = require('budo');
var less = require('./less');
var copy = require('./copy');

process.env.NODE_ENV = config.type;
process.env.ASSET_PATH = config.ASSET_PATH;

var b = budo(config.entry, {
  serve: config.bundle,
  open: true,
  dir: ['./static','./.tmp'],
  stream: process.stdout
});
b.live();
b.watch(['**/*.{html,css,less}',config.raw+'**/*.*']);
b.on('watch',function(e,file) {
  if (file.indexOf(path.basename(config.raw))>-1) {
    copy(file);
  } else if (file.indexOf('.less')>-1) {
    less(function() {
      b.reload('main.css');
    });
  } else {
    b.reload(file);
  }
});
b.on('pending',b.reload.bind(b));
b.on('update',function() {
  b.reload(config.bundle);
});

'use strict';
var path = require('path');
var config = require('./config');
var budo = require('budo');
var style = require('./style');
var copy = require('./copy');

process.env.NODE_ENV = config.type;
process.env.ASSET_PATH = config.ASSET_PATH;

var b = budo(config.entry, {
  serve: config.bundle,
  open: true,
  dir: config.output,
  stream: process.stdout{{if pushState}},
  pushstate: true{{/if}}
});
b.live();
b.watch(['**/*.{html,css,less,scss}',config.raw+'**/*.*']);
b.on('watch',function(e,file) {
  if (file.indexOf(path.basename(config.raw))>-1) {
    copy(file);
  } else if (file.indexOf('.less')>-1 || file.indexOf('.scss')>-1) {
    style(function() {
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

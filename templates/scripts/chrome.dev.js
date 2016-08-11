'use strict';
var tasks = require('./chrome.tasks');

tasks('dev', run);

'use strict';
var path = require('path');
var config = require('./config');
var budo = require('budo');
var style = require('./style');
var copy = require('./copy');

process.env.NODE_ENV = config.NODE_ENV;
process.env.ASSET_PATH = config.ASSET_PATH;
function run() {
  var server = budo(config.entry, {
    serve: config.bundle,
    open: false,
    port: 3000,
    debug: true,
    dir: config.output,
    stream: process.stdout,
    pushstate: true
  });
  server.watch(['**/*.{html,css,less,scss}',config.raw+'**/*.*'])
  .on('watch',function(e,file) {
    if (file.indexOf(path.basename(config.raw))>-1) {
      copy(file);
    } else if (file.indexOf('.less')>-1 || file.indexOf('.scss')>-1) {
      style(function() {
        server.reload('main.css');
      });
    } else {
      server.reload(file);
    }
  })
  .on('pending', server.reload.bind(server))
  .on('update',function() {
    server.reload(config.bundle);
  });  
  server.live();
}

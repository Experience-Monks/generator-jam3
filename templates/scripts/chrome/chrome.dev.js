'use strict';
var tasks = require('./chrome.tasks');
var path = require('path');
var config = require('./config');
var budo = require('budo');
var style = require('./style');
var copy = require('./copy');
var browserify = require('browserify');
var fs = require('fs');
var pkg = require('../package.json');
var deps = Object.keys(pkg.dependencies);

tasks.dev(function() {
  copy();
  style(run);  
});

function run() {
  var server = budo(config.entry, {
    serve: config.bundle,
    open: false,
    port: 3000,
    debug: true,
    dir: config.output,
    stream: process.stdout,
    pushstate: false
  });
  server.watch(['**/*.{html,css,less,scss,js}',config.raw+'**/*.*'])
  .on('watch',function(e,file) {
    if(file.split('/')[0] === 'dev') return;
    console.log(file);
    if (file.indexOf(path.basename(config.raw))>-1) {
      copy(file);
    } else if (file.indexOf('.less')>-1 || file.indexOf('.scss')>-1) {
      style(function() {
        server.reload('main.css');
      });
    } else {
      copy();
      style(function() {
        rebuild(server.reload.bind(this, file));
      })
    }
  })
  .on('pending', server.reload.bind(server))
  .on('update',function() {
    server.reload(config.bundle);
  });  
  server.live();
}

function rebuild(cb) {
  if (config.vendor && typeof config.vendor === 'string') {
    browserify(config.entry).external(deps).bundle(function(err, buff) {
      if(err) throw new Error(err.message);
      fs.writeFileSync('dev/bundle.js', buff);
      browserify().require(deps).bundle(function(err, buff) {
        if(err) throw new Error(err.message);
        fs.writeFileSync('dev/vendor.js', buff);
      });
    })
  } else {
    browserify(config.entry).bundle(function(err, buff) {
      if(err) throw new Error(err.message);
      fs.writeFileSync('dev/bundle.js', buff);
      cb();    
    });
  }
}

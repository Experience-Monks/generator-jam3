'use strict';
var fs = require('fs');
var config = require('./config');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var uglify = require('uglify-js');
var concat = require('concat-stream');

process.env.NODE_ENV = config.type;
process.env.ASSET_PATH = config.ASSET_PATH;

var output = concat(function(src) {
  var min = uglify.minify(src.toString(),{fromString: true});
  mkdirp(config.output,function(err) {
    if (!err) {
      fs.writeFile(config.output+config.bundle,min.code,function(err) {
        console.log((err) ? 'Failed to output JS' : 'JS Saved');
      });
    } else {
      console.log('Cannot create ouput folder');
    }
  });
});

browserify(config.entry)
.bundle().pipe(output);

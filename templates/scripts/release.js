'use strict';
var fs = require('fs');
var config = require('./config');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var uglify = require('uglify-js');
var concat = require('concat-stream');

process.env.NODE_ENV = config.NODE_ENV;
process.env.ASSET_PATH = config.ASSET_PATH;

var output = concat(function(src) {
  mkdirp(config.output,function(err) {
    if (!err) {
      try {
        var min = uglify.minify(src.toString(),{fromString: true});
      } catch(err) {
        fs.writeFile(config.output+config.bundle,src.toString(),function(e) {
          console.log('\x1b[31m Error at line',err.line+':',err.message+'\x1b[0m');
        });
      }
      if (min) {
        fs.writeFile(config.output+config.bundle,min.code,function(err) {
          console.log((err) ? '\x1b[31m Failed to output JS\x1b[0m' : '\x1b[32m JS Saved\x1b[0m');
        });
      }
    } else {
      console.log('\x1b[31m Cannot create ouput folder\x1b[0m');
    }
  });
});

browserify(config.entry)
.bundle().pipe(output);

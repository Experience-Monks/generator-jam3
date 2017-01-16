'use strict';
var fs = require('graceful-fs');
var path = require('path');
var config = require('./config');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var uglify = require('uglify-js');
var concat = require('concat-stream');
var pkg = require('../package.json');
var deps = Object.keys(pkg.dependencies);

var post = function(file,src) {
  mkdirp(config.output,function(err) {
    if (!err) {
      var code = src.toString();
      if (config.minify) {
        try {
          var min = uglify.minify(code,{fromString: true, compress: {drop_console: config.removeLogs===false ? false : true}});
          code = min.code;
        } catch(err) {
          console.log('\x1b[31m Error at line',err.line+':',err.message+'\x1b[0m');
        }
      }
      fs.writeFile(path.join(config.output,file),code,function(err) {
        console.log((err) ? '\x1b[31m Failed to output '+file+'\x1b[0m' : '\x1b[32m '+file+' created successfully.\x1b[0m');
      });
    } else {
      console.log('\x1b[31m Cannot create ouput folder\x1b[0m');
    }
  });
};

if (config.vendor && typeof config.vendor === 'string') {
  browserify(config.entry).external(deps).bundle().pipe(concat(post.bind(undefined,config.bundle)));
  browserify().require(deps).bundle().pipe(concat(post.bind(undefined,config.vendor)));
} else {
  browserify(config.entry).bundle().pipe(concat(post.bind(undefined,config.bundle)));
}

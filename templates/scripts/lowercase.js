'use strict';
var config = require('./config');
var glob = require('glob');
var fs = require('graceful-fs');
var path = require('path');

var loc = path.join(config.raw,'**/*');
glob(loc,function(err,files) {
  if (!err) {
    files.forEach(function(cur) {
      var lower = parsePath(cur);
      if (cur!==lower) {
        fs.rename(cur,lower,function(err) {
          if (err) console.log(err);
        });
      }
    });
  } else {
    console.log(err);
  }
});

function parsePath(path) {
  return path.toLowerCase().replace(' ','-');
}

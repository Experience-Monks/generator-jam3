'use strict';
var config = require('./config');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var less = require('less');
var lessGlobPlugin = require('less-plugin-glob');
var lessPrefixPlugin = new(require('less-plugin-autoprefix'))({
  browsers: ['last 2 versions', 'Chrome 42', 'Firefox 37', 'iOS 7', 'Safari 5', 'Explorer 8']
});

var running = false;
var lessOutput = path.basename(config.style).replace('.less','.css');
var createLess = function(callback) {
  if (running) return;
  running = true;
  fs.readFile(config.style,'UTF-8',function(err,data) {
    if (!err) {
      mkdirp(path.basename(config.output),function(err) {
        if (!err) {
          data += createModifyVars({ASSET_PATH: config.ASSET_PATH});
          less.render(data,{
            paths: [path.dirname(config.style)],
            filename: lessOutput,
            plugins: [lessPrefixPlugin,lessGlobPlugin],
            compress: true,
            sourceMap: {
              sourceMapFilename: path.join(config.output,lessOutput+'.map'),
              sourceMapBasepath: config.output
            }
          },function(err,output) {
            if (!err) {
              fs.writeFile(path.join(config.output,lessOutput),output.css,function(err) {
                console.log((err) ? 'cannot write css file.' : 'successfully wrote css file.');
                running = false;
                if (callback) callback();
              });
              fs.writeFile(path.join(config.output,lessOutput+'.map'),output.map,function(err) {
                console.log((err) ? 'cannot write css map file.' : 'successfully wrote css map file.');
              });
            } else {
              console.err(err);
            }
          });
        }
      });
    }
  });
};

function createModifyVars(vars) {
  var str = '';
  Object.keys(vars).map(function(cur) {
    str += '@' + cur + ':\'' + vars[cur] + '\';';
  });
  return (str!='') ? '\n' + str : '';
}

if (!module.parent) {
  createLess();
} else {
  module.exports = createLess;
}


'use strict';
var config = require('../scripts/config');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');
var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin');

function copy(file) {
  if (file) {
    copyFile(path.join(config.output,'assets/'),config.raw,file);
  } else {
    glob(path.join(config.raw,'**/*'),{dot: true, nodir: true},function(err,files) {
      if (!err) {
        files.forEach(copyFile.bind(null,path.join(config.output,'assets/'),config.raw));
      } else {
        console.log(err);
      }
    });
    glob(path.join(config.static,'**/*'),{dot: true, nodir: true},function(err,files) {
      if (!err) {
        files.forEach(copyFile.bind(null,path.join(config.output),config.static));
      } else {
        console.log(err);
      }
    });
  }
}

function copyFile(outputDir,srcDir,file) {
  var output = path.join(outputDir,path.normalize(file).replace(path.normalize(srcDir),''));
  mkdirp(path.dirname(output),function(err) {
    if (!err) {
      if (config.NODE_ENV==='production' && file.indexOf('.png')>-1){
        execFile(pngquant, ['-o', output, file], function (err) {
          if(err) fs.createReadStream(file).pipe(fs.createWriteStream(output));
        });
      } else {
        fs.createReadStream(file).pipe(fs.createWriteStream(output));
      }
    } else {
      console.log('could no create folder:',path.basename(file));
    }
  });
}

if (!module.parent) {
  copy();
} else {
  module.exports = copy;
}


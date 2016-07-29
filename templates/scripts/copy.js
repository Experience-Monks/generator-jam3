'use strict';
var config = require('./config');
var fs = require('graceful-fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');
var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin');
var render = require("./template");

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
          if (err) stream(file,output);
        });
      } else {
        (srcDir === config.static) ? template(file,output) : stream(file,output);
      }
    } else {
      console.log('\x1b[31m could not create folder:',path.basename(file),'\x1b[0m');
    }
  });
}

function template(file,output) {
  fs.readFile(file,'utf8',function(err,data) {
    if (!err) {
      try {
        var content = render(data,config);
        fs.writeFile(output,content,function(err) {
          if (err) console.log('\x1b[31m could not write file:',output,'\x1b[0m');
        });
      } catch(e) {
        console.log('\x1b[31m could not parse file:',file,'\x1b[0m');
      }
    } else {
      console.log('\x1b[31m could not read file:',file,'\x1b[0m');
    }
  });
}

function stream(file,output) {
  fs.createReadStream(file).pipe(fs.createWriteStream(output));
}

if (!module.parent) {
  copy();
} else {
  module.exports = copy;
}


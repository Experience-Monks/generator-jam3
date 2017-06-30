'use strict';
var config = require('./config');
var fs = require('graceful-fs');
var url = require('url');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');
var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin');
var mozjpeg = require('mozjpeg');
var render = require("./template");
var isbinaryfile = require('isbinaryfile');

var blacklist = (config.templateBlacklist || []).map(path.normalize);

function copy(file) {
  var parsed = url.parse(config.ASSET_PATH);
  var assets = parsed.path || config.ASSET_PATH;
  if (file) {
    copyFile(path.join(config.output,assets),config.raw,file);
  } else {
    glob(path.join(config.raw,'**/*'),{dot: true, nodir: true},function(err,files) {
      if (!err) {
        files.forEach(copyFile.bind(null,path.join(config.output,assets),config.raw));
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

function isBlacklisted(file) {
  return blacklist.some(function(path) {
    return file.indexOf(path) >= 0;
  });
}

function copyFile(outputDir,srcDir,file) {
  file = path.normalize(file);
  var output = path.join(outputDir,file.replace(path.normalize(srcDir),''));
  mkdirp(path.dirname(output),function(err) {
    if (!err) {
      if (config.NODE_ENV==='production' && file.toLowerCase().indexOf('.png')>-1){
        execFile(pngquant, ['-o', output, file], function (err) {
          if (err) stream(file,output);
        });
      } else if (config.NODE_ENV==='production' && (config.JPEG_QUALITY!==false && !isNaN(config.JPEG_QUALITY)) && (file.toLowerCase().indexOf('.jpg')>-1 || file.toLowerCase().indexOf('.jpeg')>-1)) {
        execFile(mozjpeg, ['-quality', config.JPEG_QUALITY, '-progressive', '-outfile', output, file], function (err) {
          if (err) stream(file,output);
        });
      } else if(srcDir === config.static && !isBlacklisted(file) && !isbinaryfile.sync(file)) {
        template(file,output);
      } else {
        stream(file,output);
      }
    } else {
      console.log('\x1b[31m could not create folder:',path.basename(file),'\x1b[0m');
    }
  });
}

function template(file,output) {
  fs.readFile(file,'utf8',function(err,data) {
    if (!err) {
      fs.writeFile(output,render(data,config),function(err) {
        if (err) console.log('\x1b[31m could not write file:',output,'\x1b[0m');
      });
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


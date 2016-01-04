'use strict';
var config = require('./config');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var sass = require('node-sass');
var sassGlob = require('sass-glob-importer');
var sassPrefix = postcss([autoprefixer({browsers: ['last 2 versions', 'Chrome 42', 'Firefox 37', 'iOS 7', 'Safari 5', 'Explorer 8']})]);
var running = false;
var sassOutput = path.basename(config.style).replace('.scss', '.css');
var srcMapReg = new RegExp('\\/\\*# ?sourceMappingURL.+\\*\\/','g');

var createSass = function (callback) {
  if (running) return;
  running = true;
  fs.readFile(config.style, 'UTF-8', function (err, data) {
    if (!err) {
      mkdirp(path.basename(config.output), function (err) {
        if (!err) {
          data += createModifyVars({
            ASSET_PATH: config.ASSET_PATH
          });
          sass.render({
            data: data,
            file: config.style,
            importer: sassGlob(),
            compress: true,
            outFile: path.join(config.output, sassOutput),
            outputStyle: 'compressed',
            sourceMap: true,
            sourceMapRoot: config.output
          }, function (err, output) {
            if (!err) {
              var css = output.css.toString();
              var srcMap = srcMapReg.exec(css);
              sassPrefix.process(css).then(function(output) {
                fs.writeFile(path.join(config.output, sassOutput), output.css + ((srcMap && srcMap[0]) ? '\n'+srcMap[0] : ''), function (err) {
                  console.log((err) ? 'cannot write css file.' : 'successfully wrote css file.');
                  running = false;
                  if (callback) callback();
                });
              },function() {
                console.log('cannot process css file.');
                running = false;
              });
              fs.writeFile(path.join(config.output, sassOutput + '.map'), output.map, function (err) {
                console.log((err) ? 'cannot write css map file.' : 'successfully wrote css map file.');
              });
            }
          });
        }
      });
    }
  });
};
function createModifyVars(vars) {
  var str = '';
  Object.keys(vars).map(function (cur) {
    str += '$' + cur + ':\'' + vars[cur] + '\';';
  });
  return (str != '') ? '\n' + str : '';
}
if (!module.parent) {
  createSass();
} else {
  module.exports = createSass;
}

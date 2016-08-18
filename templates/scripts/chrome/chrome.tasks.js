var shelljs = require('shelljs/global');
var browserify = require('browserify');
var config = require('./config');
var pkg = require('../package.json');
var deps = Object.keys(pkg.dependencies);
var fs = require('fs');

module.exports.dev = function(cb) {
  var type = 'dev';
  var env = 'dev';
  rm('-rf', type);
  mkdir(type);
  browserify('chrome/extension/background.js').bundle(function(err, buff) {
    fs.writeFileSync('chrome/background.bundle.js', buff);
    cp(`chrome/manifest.${type}.json`, `${type}/manifest.json`);
    cp('-R', 'chrome/assets/*', type);
    cp('-R', 'chrome/content_script.js', type);
    cp('chrome/background.bundle.js', type);
    exec(`jade -O "{ env: '${env}' }" -o ${type} chrome/views/`);
    if (config.vendor && typeof config.vendor === 'string') {
      browserify(config.entry).external(deps).bundle(function(err, buff) {
        if(err) throw new Error(err.message);
        fs.writeFileSync('dev/bundle.js', buff);
        browserify().require(deps).bundle(function(err, buff) {
          if(err) throw new Error(err.message);
          fs.writeFileSync('dev/vendor.js', buff);
          cb();
        });
      })
    } else {
      browserify(config.entry).bundle(function(err, buff) {
        if(err) throw new Error(err.message);
        fs.writeFileSync('dev/bundle.js', buff);
        cb();    
      });
    }
  });
};

module.exports.prod = function(cb) {
  var type = 'prod';
  var env = 'prod';
  rm('-rf', type);
  mkdir(type);
  browserify('chrome/extension/background.js').bundle(function(err, buff) {
    fs.writeFileSync('chrome/background.bundle.js', buff);
    cp(`chrome/manifest.${type}.json`, `${type}/manifest.json`);
    cp('-R', 'chrome/assets/*', type);
    cp('-R', 'chrome/content_script.js', type);
    cp('-R', 'release/assets', type + '/');
    if(fs.statSync('release/vendor.js')) cp('release/vendor.js', type + '/');
    cp('release/bundle.js', type + '/');
    cp('release/main.css', type + '/');
    cp('chrome/background.bundle.js', type);
    exec(`jade -O "{ env: '${env}' }" -o ${type} chrome/views/`);
    cp('release/index.html', type + '/popup.html');
    cb();
  });
}
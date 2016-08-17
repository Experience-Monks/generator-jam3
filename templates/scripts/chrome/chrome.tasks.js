var shelljs = require('shelljs/global');
var browserify = require('browserify');
var fs = require('fs');

module.exports = function(type, cb) {
  const env = type === 'build' ? 'prod' : type;
  rm('-rf', type);
  mkdir(type);
  browserify('chrome/extension/background.js').bundle(function(err, buff) {
    fs.writeFileSync('chrome/background.bundle.js', buff);
    cp(`chrome/manifest.${env === 'prod' ? env : 'dev'}.json`, `${type}/manifest.json`);
    cp('-R', 'chrome/assets/*', type);
    cp('-R', 'chrome/content_script.js', type);
    cp('chrome/background.bundle.js', type);
    exec(`jade -O "{ env: '${env}' }" -o ${type} chrome/views/`);
    cb();
  });
};
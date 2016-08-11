var shelljs = require('shelljs/global');
var browserify = require('browserify');
var fs = require('fs');

module.exports = function(type, cb) {
  const env = type === 'build' ? 'prod' : type;
  rm('-rf', type);
  mkdir(type);
  browserify('templates/chrome/extension/background.js').bundle(function(err, buff) {
    fs.writeFileSync('templates/chrome/background.bundle.js', buff);
    cp(`templates/chrome/manifest.${env}.json`, `${type}/manifest.json`);
    cp('-R', 'templates/chrome/assets/*', type);
    cp('-R', 'templates/chrome/content_script.js', type);
    cp('templates/chrome/background.bundle.js', type);
    exec(`jade -O "{ env: '${env}' }" -o ${type} templates/chrome/views/`);
    cb();
  });
};
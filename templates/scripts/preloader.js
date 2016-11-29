var fs = require('graceful-fs');
var path = require('path');
var junk = require('junk');
var data = require('../config-preloader.json');

var OUTPUT_PATH = path.resolve(__dirname, '..', 'raw-assets/preload-list.json');

var walkSync = function(dir) {
  var files = fs.readdirSync(dir);
  var fileList = [];

  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = walkSync(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  });
  return fileList;
};

var filterJunk = function(arr) {
  return arr.filter(function(f) {
    return junk.not(path.basename(f)) && !(/(^|\/)\.[^\/\.]/g).test(f) // filter hidden files too eg '.gitkeep'
  });
};

var getPreloadFileList = (function() {
  var assets = [];

  data.forEach(function(currPath) {
    var assetPath = path.resolve(__dirname, '..', currPath);
    var isDirectory = false;

    try {
      isDirectory = fs.statSync(assetPath).isDirectory();
    } catch (e) {

    }

    if (isDirectory) {
      var files = walkSync(assetPath);
      assets = assets.concat(files);
    } else {
      assets.push(assetPath);
    }
  });

  assets = filterJunk(assets);

  assets = assets.map(function(asset) {
    return '/assets' + asset.split('raw-assets')[1]
  });

  fs.writeFile(OUTPUT_PATH, JSON.stringify(assets, null, 2), function(err, data) {
    if (err) {
      return console.log(err);
    } else {
      console.log('"' + OUTPUT_PATH + '" is written');
    }
  });

})();

module.exports = getPreloadFileList;
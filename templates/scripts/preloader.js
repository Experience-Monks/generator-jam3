var fs = require('graceful-fs');
var path = require('path');
var junk = require('junk');
var config = require('../config.json');
var data = require('../config-preloader.json');
var argv = require('minimist')(process.argv.slice(2));

var env = argv.env || process.env.NODE_ENV || 'development';
var envAssetPath = config[env].ASSET_PATH || config.defaults.ASSET_PATH;
var root = path.resolve(__dirname, '..');
var OUTPUT_JSON = path.resolve(root, 'raw-assets/preload-list.json');

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
    return junk.not(path.basename(f)) && !(/(^|\/)\.[^\/\.]/g).test(f); // filter hidden files too eg '.gitkeep'
  });
};

var getPreloadFileList = (function() {
  var assets = [];

  data.forEach(function(currPath) {
    var assetPath = path.resolve(root, 'raw-assets', currPath);

    try {
      // check if directory
      fs.statSync(assetPath).isDirectory();
      var files = walkSync(assetPath);
      assets = assets.concat(files);
    } catch (e) {
      assets.push(assetPath);
    }
  });

  assets = filterJunk(assets);

  assets = assets.map(function(asset) {
    asset = asset.split('raw-assets')[1];
    return '.' + path.sep + path.join(envAssetPath + asset);
  });

  fs.writeFile(OUTPUT_JSON, JSON.stringify(assets, null, 2), function(err, data) {
    if (err) {
      return console.log(err);
    } else {
      console.log('Preloader assets:', assets);
    }
  });

})();

module.exports = getPreloadFileList;
'use strict';
var fs = require('graceful-fs');
var glob = require('glob');
var path = require('path');
var junk = require('junk');
var config = require('./config');
var data = require('../config-preloader.json');

function getPreloadList(cb) {
  var assets = [];
  var count = 0;
  var done = function(err,files) {
    assets = assets.concat(files);
    count++;
    if (count>=data.length) {
      assets = assets.map(function(cur) {
        if (junk.not(path.basename(cur))) {
          return config.ASSET_PATH + path.normalize(cur).replace(path.normalize(config.raw),'').replace(/\\/g, "/");
        }
      }).filter(Boolean);
      if (cb) {
        cb(assets);
      } else {
        fs.writeFile(path.join(config.raw, 'preload.json'), JSON.stringify(assets, null, 2), function(err, data) {
          console.log((err) ? '\x1b[31m cannot write preloader.json.\x1b[0m' : '\x1b[32m successfully wrote preloader.json.\x1b[0m');
        });
      }
    }
  };
  data.forEach(function(cur) {
    cur = path.join(config.raw,cur);
    if (glob.hasMagic(cur)) {
      glob(cur,{dot: false, nodir: true},done);
    } else {
      done(undefined,path.join(config.raw,cur));
    }
  });
}

if (!module.parent) {
  getPreloadList();
} else {
  module.exports = getPreloadList;
}
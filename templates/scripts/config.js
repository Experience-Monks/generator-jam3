'use strict';
var fs = require('fs');
var merge = require('merge');
var argv = require('minimist')(process.argv.slice(2));
var type = argv.env || process.env.NODE_ENV || 'development';
var configs = require('../config.json');
var config = merge.recursive(configs.defaults, configs[type]);
var path = require('path');

config.stylesheet = path.parse(config.style).name + '.css';

if (type==='production' && config.timestamp) {
  var delimiter = '-';
  var stamp = typeof config.timestamp === 'string' ? config.timestamp : fs.readFileSync('timestamp.txt');
  if (stamp) {
    var stamp = delimiter + stamp;
    config.stylesheet = path.parse(config.style).name.split(delimiter)[0] + stamp + '.css';

    config.bundle = path.parse(config.bundle).name.split(delimiter)[0] + stamp + '.js';
    if (config.vendor) config.vendor = path.parse(config.vendor).name.split(delimiter)[0] + stamp + '.js';
    
    var parsed = path.parse(config.ASSET_PATH);
    config.ASSET_PATH = path.join(parsed.dir, parsed.base+stamp);
  }
}

config.NODE_ENV = type;
process.env.NODE_ENV = config.NODE_ENV;
process.env.BASENAME = config.BASENAME;
process.env.ASSET_PATH = config.ASSET_PATH;
if (config.env) {
  Object.keys(config.env).forEach(function(cur) {
    process.env[cur] = config.env[cur];
  });
}
module.exports = config;
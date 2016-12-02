'use strict';
var merge = require('merge');
var argv = require('minimist')(process.argv.slice(2));
var type = argv.env || process.env.NODE_ENV || 'development';
var configs = require('../config.json');
var config = merge.recursive(configs.defaults, configs[type]);
var path = require('path');

if (type === 'production') {
  config.stylesheet = addTimestamp(path.parse(config.style).name + '.css');
  config.bundle = addTimestamp(config.bundle);
  if (config.vendor && typeof config.vendor === 'string') {
    config.vendor = addTimestamp(config.vendor);
  }
} else {
  config.stylesheet = path.parse(config.style).name + '.css';
}

function addTimestamp(file) {
  return path.parse(file).name + '_' + config.timestamp + path.extname(file);
}

config.addTimestamp = addTimestamp;
config.NODE_ENV = type;
module.exports = config;
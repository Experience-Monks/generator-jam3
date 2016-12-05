'use strict';
var merge = require('merge');
var argv = require('minimist')(process.argv.slice(2));
var type = argv.env || process.env.NODE_ENV || 'development';
var configs = require('../config.json');
var config = merge.recursive(configs.defaults, configs[type]);
var path = require('path');

if (type === 'development') {
  config.stylesheet = path.parse(config.style).name + '.css';
}

config.NODE_ENV = type;
module.exports = config;
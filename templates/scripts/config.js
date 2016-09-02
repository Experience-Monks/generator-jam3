'use strict';
var merge = require('merge');
var argv = require('minimist')(process.argv.slice(2));
var type = argv.env || process.env.NODE_ENV || 'development';
var configs = require('../config.json');
var config = merge(true, configs.defaults || {}, configs[type]);
config.NODE_ENV = type;
module.exports = config;

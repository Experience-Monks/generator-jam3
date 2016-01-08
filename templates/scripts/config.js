'use strict';
var argv = require('minimist')(process.argv.slice(2));
var type = argv.env || process.env.NODE_ENV || 'development';
var config = require('../config.json');
config[type].NODE_ENV = type;
module.exports = config[type];
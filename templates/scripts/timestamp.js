'use strict';
var moment = require('moment');
var configs = require('../config.json');
var path = require('path');
var fs = require('fs');

var delimiter = '_';
var timestamp = moment().format().substring(0, 19).replace('T', delimiter);
var postfix = delimiter + timestamp;

// css files
var style = configs.production.style || configs.defaults.style;
configs.production.stylesheet = path.parse(style).name.split(delimiter)[0] + postfix + '.css';

// js files
var bundle = configs.production.bundle || configs.defaults.bundle;
var vendor = configs.production.vendor || configs.defaults.vendor;
configs.production.bundle = path.parse(bundle).name.split(delimiter)[0] + postfix + '.js';

if (vendor) {
  configs.production.vendor = path.parse(vendor).name.split(delimiter)[0] + postfix + '.js';
}

// assets
configs.production.ASSET_PATH = './assets' + postfix + '/';

fs.writeFileSync(path.join(__dirname, '..', 'config.json'), JSON.stringify(configs, null, 2));
//console.log(configs)
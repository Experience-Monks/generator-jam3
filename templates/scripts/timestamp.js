'use strict';
var moment = require('moment');
var configs = require('../config.json');
var path = require('path');
var fs = require('fs');

configs.production.timestamp = moment().format().substring(0, 19).replace('T', '_');
fs.writeFileSync(path.join(__dirname, '..', 'config.json'), JSON.stringify(configs, null, 2));
//console.log(configs)
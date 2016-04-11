'use strict';
var rimraf = require('rimraf');
var config = require('../scripts/config');

rimraf(config.output, function(err) {
  if(err) {
    console.log(err);
  }
});

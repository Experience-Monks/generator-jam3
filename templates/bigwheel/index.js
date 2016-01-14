'use strict';
var domready = require('domready');
var framework = require('./lib/framework');

domready(function() {
  framework.init();
});

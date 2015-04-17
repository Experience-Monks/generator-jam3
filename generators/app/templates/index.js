'use strict';
var domready = require('detect-dom-ready');
var framework = require( './lib/framework' );

domready(function() {
  framework.init();
});

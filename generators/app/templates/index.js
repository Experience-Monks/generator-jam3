'use strict';
var domready = require('domready');
var framework = require( './lib/framework' );
<% if (useES6) { %>var babelify = require('babelify/polyfill.js');
<% } %>
domready(function() {
  framework.init();
});

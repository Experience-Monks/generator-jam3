'use strict';
var bigwheel = require('bigwheel');
var analytics = require('bw-analytics');
var model = require('../model');
module.exports = analytics(model.settings.UA, bigwheel(function(done) {
  done({
    initSection: require('../sections/Preloader/{{if sectionNames}}Preloader{{else}}index{{/if}}.js'),
    routes: require('./routes')
  });
}));

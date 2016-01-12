'use strict';
var path = require('path');
module.exports = function(gen,cb) {
  var model = require(path.join(process.cwd(),'lib/model/index.js'));
  var sections = ['Preloader'];
  for (var key in model) {
    if (key.charAt(0)==="/") sections.push(key.substr(1) || 'Landing');
  }
  var count = 0;
  var total = sections.length*4;
  var name = gen.config.get('sectionNames') ? '{{section}}.js' : 'index.js';
  var done = function(argument) {
    count++;
    if (cb && count>=total) cb();
  };
  sections.forEach(function(cur) {
    var type = cur==='preloader' ? 'preloader' : 'normal';
    gen.config.set('section',cur);
    gen.copy('../templates/sections/{{framework}}/'+type+'/index.js','lib/sections/{{section}}/'+name,done);
    gen.copy('../templates/sections/{{framework}}/'+type+'/style.css','lib/sections/{{section}}/style.{{css}}',done);
    gen.copy('../templates/sections/{{framework}}/'+type+'/template.hbs','lib/sections/{{section}}/template.hbs',done);
    gen.copy('../templates/.gitkeep','lib/ui/{{section}}/.gitkeep',done);
  });
};
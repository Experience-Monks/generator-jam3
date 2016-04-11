'use strict';
var path = require('path');
var fs = require('fs');
module.exports = function(gen,cb) {
  var model = require(path.join(process.cwd(),'src/model/index.js'));
  var sections = ['Preloader'];
  Object.keys(model)
    .forEach(function(key) {
      if (key.charAt(0)==="/") sections.push(key.substr(1) || 'Landing');
    });
  nextSection(sections,gen,cb);
};

function nextSection(arr,gen,cb) {
  if (arr.length>0) {
    createSection(arr.shift(),gen,function() {
      nextSection(arr,gen,cb);
    });
  } else {
    if (cb) cb();
  }
}

function createSection(cur,gen,cb) {
  var name = gen.config.get('sectionNames') ? '{{section}}.js' : 'index.js';
  var count = 0;
  var done = function() {
    count++;
    if (count>=4) cb();
  };
  fs.stat('src/sections/'+cur+'/',function(err,stat) {
    if (err) {
      var type = cur==='Preloader' ? 'preloader' : 'normal';
      gen.config.set('section',cur);
      gen.copy('templates/sections/{{framework}}/'+type+'/index.js','src/sections/{{section}}/'+name,done);
      gen.copy('templates/sections/{{framework}}/'+type+'/style.css','src/sections/{{section}}/style.{{css}}',done);
      gen.copy('templates/sections/{{framework}}/'+type+'/template.hbs','src/sections/{{section}}/template.hbs',done);
      gen.copy('templates/.gitkeep','src/ui/{{section}}/.gitkeep',done);
    } else {
      count += 3;
      done();
    }
  });
};
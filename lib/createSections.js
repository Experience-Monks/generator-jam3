'use strict';
var path = require('path');
var fs = require('fs');
module.exports = function(gen,cb) {
  var sections;
  if (gen.config.get('framework')==='bigwheel') {
    var model = require(path.join(process.cwd(),'src/model/index.js'));
    sections = ['Preloader'];
    Object.keys(model).forEach(function(key) {
      if (key.charAt(0)==="/") sections.push(key.substr(1) || 'Landing');
    });
  } else {
    sections = ['Landing'];
  }
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
  var total = 0;
  var done = function() {
    count++;
    if (count>=total) cb();
  };
  fs.stat('src/sections/'+cur+'/',function(err,stat) {
    if (err) {
      gen.config.set('section',cur);
      if (gen.config.get('framework')==='bigwheel') {
        var type = cur==='Preloader' ? 'preloader' : 'normal';
        gen.copy('templates/sections/{{framework}}/'+type+'/index.js','src/sections/{{section}}/'+name,done);
        gen.copy('templates/sections/{{framework}}/'+type+'/style.css','src/sections/{{section}}/style.{{css}}',done);
        gen.copy('templates/.gitkeep','src/ui/{{section}}/.gitkeep',done);
        total += 3;
      } else if (gen.config.get('framework')==='react') {
        gen.copy('templates/sections/{{framework}}/index.js','src/sections/{{section}}/'+name,done);
        gen.copy('templates/sections/{{framework}}/style.css','src/sections/{{section}}/style.{{css}}',done);
        gen.copy('templates/sections/{{framework}}/states.js','src/sections/{{section}}/states.js',done);
        gen.copy('templates/sections/{{framework}}/transitions.js','src/sections/{{section}}/transitions.js',done);
        total += 4;
      }
    } else {
      done();
    }
  });
};
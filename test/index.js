var rf = require('rimraf');
var fs = require('fs');

process.chdir('test');
rf('output/*',function() {
  rf('output/.*',function() {
    fs.mkdir('output',function() {
      process.chdir('output');
      var fn = require('../');
      if (typeof fn === 'function') fn();
    });
  });
});
var glob = require('glob');
var path = require('path');
var fs = require('fs');

module.exports = function(callback) {
  var styleExtention = "scss";
  var file = this.destinationPath('lib/styles/main.'+styleExtention);
  var includes = ['normalize.'+styleExtention,'vars.'+styleExtention,'fonts.'+styleExtention,'global.'+styleExtention];
  var source = this.destinationPath('lib/styles/');
  var sass = this.destinationPath('lib/styles/**/*.'+styleExtention);
  var ui = this.destinationPath('lib/ui/**/*style.*');
  var sections = this.destinationPath('lib/sections/**/*style.*');
  glob(sass,function(err,files) {
    files.map(function(cur) {
      var norm = path.normalize(path.relative(source,cur));
      if (includes.indexOf(norm)===-1 && norm!==('main.'+styleExtention)) includes.push(norm);
    });
    glob(sections,function(err,files) {
      files.map(function(cur) {
        includes.push(path.normalize(path.relative(source,cur)));
      });
      glob(ui,function(err,files) {
        files.map(function(cur) {
          includes.push(path.normalize(path.relative(source,cur)));
        });
        var str = '/**\n * Any changes will automatically be overwritten by the Jam3Generator \n */\n';
        includes.map(function(cur) {
          str += '@import "'+cur+'";\n';
        });
        fs.writeFile(file, str, callback);
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

var glob = require('glob');
var path = require('path');
var fs = require('fs');

module.exports = function(callback) {
  var file = this.destinationPath('lib/less/main.less');
  var includes = ['normalize.less','vars.less','fonts.less','global.less'];
  var source = this.destinationPath('lib/less/');
  var less = this.destinationPath('lib/less/**/*.less');
  var ui = this.destinationPath('lib/ui/**/*style.*');
  var sections = this.destinationPath('lib/sections/**/*style.*');
  glob(less,function(err,files) {
    files.map(function(cur) {
      var norm = path.normalize(path.relative(source,cur));
      if (includes.indexOf(norm)===-1 && norm!=='main.less') includes.push(norm);
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

module.exports = function(grunt) {
  grunt.registerMultiTask('texturepacker', function() {
    var done = this.async();
    var source = this.data;
    var options = this.options();
    var exec = require('child_process').exec;
    var fs = require('fs');
    var path = require('path');

    var join = (grunt.util.linefeed == "\r\n") ? " & " : "; ";
    var cmd = "";
    var files = fs.readdirSync(source);

    var noImages = false;

    grunt.log.ok("Running TP source: ", source);

    files.forEach(function(f) {
      if (path.extname(f).toLowerCase() == '.tps') {
        grunt.log.ok("Writing sprite sheet: " + f);
        //cmd += "TexturePacker " + path.join(source, f) +((options.multipack) ? " --multipack" : "")+ " --texturepath "+options.texturepath+ join;
        cmd += "TexturePacker " + path.join(source, f) + ((options.multipack) ? " --multipack" : "") + ((options.texturepath) ? (" --texturepath " + options.texturepath) : "") + join;
      }
    });
    grunt.log.ok("Running TP cmd: ", cmd);
    grunt.verbose.subhead(cmd);
    var child = exec(cmd, function(error, stdout, stderr) {
      if (error !== null && !noImages) {
        grunt.log.error('exec error: ' + error);
        done(false);
      } else {
        done();
      }
    });
    if (options.stdout) {
      child.stdout.on('data', function(chunk) {
        grunt.log.write(chunk);
      });
    }
    child.stderr.on('data', function(chunk) {
      if (chunk.toLowerCase().indexOf("no sprite sheet written") > -1) {
        noImages = true;
      } else {
        noImages = false;
        grunt.log.error(chunk);
      }
    });
  });
};

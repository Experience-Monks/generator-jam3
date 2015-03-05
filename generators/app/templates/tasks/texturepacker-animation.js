module.exports = function(grunt) {
  grunt.registerMultiTask('animation', function() {
    var done = this.async();
    var exec = require('child_process').exec;
    var cheerio = require('cheerio');
    var fs = require('fs');
    var path = require('path');
    var source = this.data;
    var options = this.options();
    var template = fs.readFileSync(options.template,"utf-8");
    var dest = options.dest;

    var join = (grunt.util.linefeed == "\r\n") ? " & " : "; ";
    var cmd = "";
    var files = fs.readdirSync(source);
    files.forEach(function(f) {
      if (path.extname(f).toLowerCase() == '.swf') {
        var name = path.basename(f,'.swf');
        var tps = cheerio.load(template,{xmlMode: true});
        var settings = tps('data struct');
        var output = dest+'animation-'+name+'.tps';
        settings.children('filename').html('animation-'+name+'{v}.png')
        settings.find('struct struct[type="DataFile"] filename').html('animation-'+name+'{v}.json');
        settings.find('struct filename[type="source"]').html(path.relative(dest,source+f));
        fs.writeFileSync(output, tps.xml());
        grunt.log.ok("Writing sprite sheet: " + f);
        cmd += "TexturePacker " + output + join;
      }
    });
    grunt.verbose.subhead(cmd);
    var child = exec(cmd,function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
            done(false);
        } else {
          done();
        }
    });
    if (options.stdout) {
      child.stdout.on('data',function(chunk) {
        grunt.log.write(chunk);
      });
    }
    child.stderr.on('data',function(chunk) {
      grunt.log.error(chunk);
    });
  });
};

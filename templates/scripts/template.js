var hbs = require('handlebars');
var path = require('path');
var fs = require('fs');
var walk = require('walk').walk;


hbs.registerHelper('is', function(variable,test,options) {
  if (variable !== test) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});


//
// Mostly taken from hbs package
//
registerPartials = function (directory, done) {

  var register = function(filepath, done) {
    var isValidTemplate = /\.(html|hbs)$/.test(filepath);

    if (!isValidTemplate) {
      return done(null);
    }

    fs.readFile(filepath, 'utf8', function(err, data) {
      if (!err) {
        var ext = path.extname(filepath);
        var templateName = path.relative(directory, filepath)
          .slice(0, -(ext.length)).replace(/[ -]/g, '_').replace('\\', '/');
        hbs.registerPartial(templateName, data);
      }
      done(err);
    });
  };

  walk(directory).on('file', function(root, stat, next) {
    register(path.join(root, stat.name), next);
  }).on('end', done || function() {});

};
registerPartials("./src/partials/");


module.exports = function(template,data) {
  var render = hbs.compile(template);
  return render(data);
};

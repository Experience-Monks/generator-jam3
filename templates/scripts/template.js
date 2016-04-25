var hbs = require('handlebars');
hbs.registerHelper('is', function(variable,test,options) {
  if (variable !== test) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

module.exports = function(template,data) {
  var render = hbs.compile(template);
  return render(data);
};
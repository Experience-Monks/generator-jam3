var nyg = require('nyg');
var createSections = require('./lib/createSections');
var prompts = [{
  type: "input",
  name: "author",
  message: "What is your name? (Author)",
  default: "Jam3"
}, {
  type: "input",
  name: "email",
  message: "What is your email? (Author Email)",
  default: "td@jam3.com"
}, {
  type: "input",
  name: "description",
  message: "Describe the project:",
  default: "A Jam3 project"
}, {
  type: "input",
  name: "repo",
  message: "What is your git repository? (GitHub Repository)",
  default: ""
}, {
  type: "confirm",
  name: "sectionNames",
  message: "Would you perfer Landing/Landing.js over Landing/index.js?",
  default: false
}, {
  type: "confirm",
  name: "useES6",
  message: "Would you like to use ES6?",
  default: false
}, {
  type: "list",
  message: "What framework will your project use?",
  name: "framework",
  choices: [{
    name: "Bigwheel / Handlebars",
    value: "bigwheel",
    checked: true
  }/*, {
    name: "React",
    value: "react"
  }, {
    name: "Angular",
    value: "angular"
  }*/]
},{
  type: "list",
  message: "What css preprocessor will your project use?",
  name: "css",
  choices: [{
    name: "SCSS",
    value: "scss",
    checked: true
  },{
    name: "LESS",
    value: "less"
  }]
}];
var globs = [
  { base: 'templates/{{framework}}/' },
  { base: 'templates/', glob: 'scripts/*' },
  { base: 'templates/base/' },
  { base: 'templates/style/', output: 'lib/style/' },
  { base: 'templates/scripts/{{css}}/', glob: '*', output: 'scripts/' }
];
var gen = nyg(prompts,globs)
.on('postprompt',function() {
  var repo = gen.config.get('repo').match('\/(.*?).git');
  if (repo && repo[1]) gen.config.set('folder', repo[1]);
  if (gen.config.get('framework')==='bigwheel') {
    gen.prompt({
      type: "confirm",
      name: "pushState",
      message: "Use push states?",
      default: true
    },gen.async());
  }
})
.on('postcopy',function() {
  var done = gen.async();
  createSections(gen,done);
})
.run();
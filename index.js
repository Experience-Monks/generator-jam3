var nyg = require('nyg');
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
  }, {
    name: "React",
    value: "react"
  }, {
    name: "Angular",
    value: "Angular"
  }]
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
  { base: 'templates/style/', output: 'lib/{{css}}/' },
  { base: 'templates/scripts/{{css}}/', glob: '*', output: 'scripts/' }
];
nyg(prompts,globs).run();
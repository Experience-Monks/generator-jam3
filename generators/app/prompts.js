module.exports = [{
  type: "input",
  name: "projectAuthor",
  message: "What is your name? (Author)",
  default: "Jam3"
}, {
  type: "input",
  name: "projectAuthorEmail",
  message: "What is your email? (Author Email)",
  default: "td@jam3.com"
}, {
  type: "input",
  name: "projectDescription",
  message: "Describe the project:",
  default: "A Jam3 project"
}, {
  type: "input",
  name: "projectRepository",
  message: "What is your git repository? (GitHub Repository)",
  default: ""
}, {
  type: "confirm",
  name: "changeFileNaming",
  message: "Would you perfer Landing/Landing.js over Landing/index.js?",
  default: false
}, {
  type: "confirm",
  name: "useES6",
  message: "Would you like to use ES6?",
  default: false
}, {
  type: "confirm",
  name: "useTexturePackager",
  message: "Would you like to use TexturePacker? (Beta)",
  default: false
}, {
  type: "checkbox",
  message: "What will your project use?",
  name: "baseSelector",
  choices: [{
    name: "DOM",
    value: "dom",
    checked: true
  }, {
    name: "CANVAS",
    value: "canvas"
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

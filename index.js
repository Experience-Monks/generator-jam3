var fs = require('fs');
var path = require('path');
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
  type: "list",
  message: "What framework will your project use?",
  name: "framework",
  choices: [{
    name: "React",
    value: "react"
  },{
    name: "Bigwheel / Handlebars",
    value: "bigwheel",
    checked: true
  },
  {
    name: "None",
    value: "none"
  }]
},{
  type: "confirm",
  name: "vendor",
  message: "Seperate common npm modules into vendor.js?",
  default: true
},{
  type: "list",
  message: "Is your project an app?",
  name: "app",
  default: 'no',
  choices: [{
    name: "No",
    value: 'no'
  },{
    name: "Electron App",
    value: "electron"
  }, {
    name: "Chrome Extension",
    value: "chrome"
  }]
}
];
var globs = [
  { base: 'templates/{{framework}}/' },
  { base: 'templates/', glob: 'scripts/*' },
  { base: 'templates/base/' },
  { base: 'templates/style/', output: 'src/style/' },
  { base: 'templates/scripts/{{css}}/', glob: '*', output: 'scripts/' },
  { base: 'templates/unsupported/{{unsupported}}', output: 'static/' },
  { base: 'templates/unsupported/', glob: '*', output: 'static/' },
  { base: 'templates/unsupported/images/', output: 'raw-assets/images/unsupported/' }
];
var gen = nyg(prompts,globs)
.on('postprompt',function() {
  var repo = gen.config.get('repo').match('\/(.*?).git');
  gen.config.set('repoName', repo && repo[1] ? repo[1] : '');
  if (gen.config.get('framework')!=='none') {
    var done = gen.async();
    gen.prompt({
      type: "confirm",
      name: "sectionNames",
      message: "Would you perfer Landing/Landing.js over Landing/index.js?",
      default: false
    },function() {
      if (gen.config.get('framework')!=='none' && gen.config.get('app') !== 'electron') {
        gen.prompt({
          type: "confirm",
          name: "pushState",
          message: "Use push states?",
          default: true
        },function() {
          gen.prompt({
            type: "list",
            message: "What css preprocessor will your project use?",
            name: "css",
            choices: [
            {
              name: "SCSS",
              value: "scss",
              checked: true
            },
            {
              name: "LESS",
              value: "less"
            }]
          },function() {
            if (gen.config.get('framework')==='bigwheel') {
              gen.prompt({
                type: "confirm",
                name: "useES6",
                message: "Would you like to use ES6?",
                default: true
              },done);
            } else {
              gen.config.set('useES6',true);
              done();
            }  
          })
        });
      } else if(gen.config.get('app') === 'electron') {
        gen.config.set('pushState', false);
        
        //node-sass not supported in electron yet
        gen.config.set('css', 'less');
        if (gen.config.get('framework')==='bigwheel') {
          gen.prompt({
            type: "confirm",
            name: "useES6",
            message: "Would you like to use ES6?",
            default: true
          },done);
        } else {
          gen.config.set('useES6',true);
          done();
        }
      } else {
        done();
      }
    });
  }
})
.on('postcopy',function() {
  var done = gen.async();
  fs.rename(path.join(gen.cwd,'gitignore'),path.join(gen.cwd,'.gitignore'),function() {   
    if (gen.config.get('framework')!=='none') {
      if (gen.config.get('useES6')) {
        gen.copy('templates/.babelrc','.babelrc',function() {
          if (gen.config.get('sectionNames') && gen.config.get('framework')==='react') {
            fs.rename(path.join(gen.cwd,'src/components/Preloader/index.js'),path.join(gen.cwd,'src/components/Preloader/Preloader.js'), function() {
              fs.rename(path.join(gen.cwd,'src/sections/App/index.js'),path.join(gen.cwd,'src/sections/App/App.js'), function() {
                createSections(gen,done);
              });
            });
          } else {
            createSections(gen,done);
          }
        });
      } else {
        createSections(gen,done);
      }
    } else {
      fs.writeFile(path.join(gen.cwd,'src/index.js'),'',done);
    }
  });
})
.run();
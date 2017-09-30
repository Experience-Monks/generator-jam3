var fs = require('fs');
var path = require('path');
var nyg = require('nyg');
var spawn = require('cross-spawn');

var createSections = require('./lib/createSections');
var Favicon = require('./templates/scripts/favicons/favicons.js');
var addPasswordProtection = require('./lib/addPasswordProtection.js');

var prompts = [{
  type: "input",
  name: "author",
  message: "What is your name? (Author)",
  default: ""
}, {
  type: "input",
  name: "email",
  message: "What is your email? (Author Email)",
  default: ""
}, {
  type: "input",
  name: "description",
  message: "Describe the project:",
  default: ""
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
  name: "sectionNames",
  message: "Would you prefer Landing/Landing.js over Landing/index.js?",
  default: false,
  when: function(answers) { return answers.framework!=='none'; }
},{
  type: "confirm",
  name: "pushState",
  message: "Use push states?",
  default: true,
  when: function(answers) { return answers.framework!=='none'; }
},{
  type: "confirm",
  name: "useES6",
  message: "Would you like to use ES6?",
  default: true,
  when: function(answers) { return answers.framework==='bigwheel' || answers.framework==='none'; }
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
},{
  type: "confirm",
  name: "vendor",
  message: "Separate common npm modules into vendor.js?",
  default: true
},{
  type: "list",
  message: "What backend language would you like to use?",
  name: "backend",
  choices: [{
    name: "PHP",
    value: "php"
  }, {
    name: "None",
    value: "none"
  }]
},{
  type: "confirm",
  name: "unsupported",
  message: "Would you like to include an unsupported page?",
  default: true
},{
  type: "input",
  name: "password",
  message: "Choose the password to use for password protection. (leave blank to disable)",
  default: ""
},{
  type: "input",
  name: "passLocation",
  message: "Where on the server will your .htpasswd be located?",
  default: "/var/www",
  when: function(answers) { return answers.password!==''; }
}];
var globs = [
  { base: 'templates/{{framework}}/' },
  { base: 'templates/', glob: 'scripts/*' },
  { base: 'templates/base/' },
  { base: 'templates/style/', output: 'src/style/' },
  { base: 'templates/scripts/{{css}}/', glob: '*', output: 'scripts/' },
  { base: 'templates/scripts/favicons/', glob: '*', output: 'scripts/favicons/' },
  { base: 'templates/backend/{{backend}}/'},
  { base: 'templates/unsupported/default/', when: function(answers) { return answers.unsupported; }},
  { base: 'templates/unsupported/{{backend}}/', when: function(answers) { return answers.unsupported; } }

];
var gen = nyg(prompts,globs,{ignore:[".phar"]})
.on('postprompt', onPostPrompt)
.on('postcopy', onPostCopy)
.on('postinstall', onPostInstall)
.run();

//*************************** Event Handlers ***************************

function onPostPrompt() {
  var repo = gen.config.get('repo').split('/');
  repo = repo[repo.length-1].toLowerCase().replace('.git','');
  gen.config.set('repoName', repo || '');
  if (gen.config.get('framework')!=='none' && gen.config.get('framework')!=='bigwheel') gen.config.set('useES6',true);
}

function onPostCopy() {
  var done = gen.async();
  fs.rename(path.join(gen.cwd,'gitignore'),path.join(gen.cwd,'.gitignore'),function() {
    if (gen.config.get('framework')!=='none') {
      if (gen.config.get('useES6')) {
        gen.copy('templates/.babelrc','.babelrc',function() {
          if (gen.config.get('sectionNames') && gen.config.get('framework')==='react') {
            var style = gen.config.get('css');
            var files = [
              [path.join(gen.cwd,'src/components/Preloader/index.js'),path.join(gen.cwd,'src/components/Preloader/Preloader.js')],
              [path.join(gen.cwd,'src/components/Preloader/style.'+style),path.join(gen.cwd,'src/components/Preloader/Preloader.'+style)],
              [path.join(gen.cwd,'src/components/Rotate/index.js'),path.join(gen.cwd,'src/components/Rotate/Rotate.js')],
              [path.join(gen.cwd,'src/components/Rotate/style.'+style),path.join(gen.cwd,'src/components/Rotate/Rotate.'+style)],
              [path.join(gen.cwd,'src/sections/App/index.js'),path.join(gen.cwd,'src/sections/App/App.js')],
              [path.join(gen.cwd,'src/sections/App/style.'+style),path.join(gen.cwd,'src/sections/App/App.'+style)],
              [path.join(gen.cwd,'src/components/HamburgerButton/index.js'),path.join(gen.cwd,'src/components/HamburgerButton/HamburgerButton.js')],
              [path.join(gen.cwd,'src/components/HamburgerButton/style.'+style),path.join(gen.cwd,'src/components/HamburgerButton/HamburgerButton.'+style)]
            ];
            renameFiles(files,function() {
              createSections(gen,done);
            });
          } else {
            createSections(gen,done);
          }
        });
      } else {
        createSections(gen,done);
      }
    } else {
      fs.writeFile(path.join(gen.cwd,'src/index.js'),'',function() {
        if (gen.config.get('useES6')) {
          gen.copy('templates/.babelrc','.babelrc',done);
        } else {
          done();
        }
      });
    }
    if (gen.config.get('password') !== '') {
      addPasswordProtection(gen.cwd, gen.config.get('password'));
    }
  });
}

function renameFiles(arr,cb) {
  var total = arr.length;
  var count = 0;
  var done = function() {
    count++;
    if (count>=total) cb();
  };
  arr.forEach(function(cur) {
    fs.rename(cur[0],cur[1],done);
  });
}

function onPostInstall() {
  var done = gen.async();
  var npm = spawn('npm', ['run','favicons'], {cwd: gen.cwd, stdio: 'inherit'});
  npm.on('error',function() {
    console.log(arguments);
  });
  npm.on('close',function(code) {
    if (code!==0) console.log(new Error('npm run favicons exited with non-zero code ' + code + '. Please try running "npm run favicons" again as administrator.'));
    done();
  });
}

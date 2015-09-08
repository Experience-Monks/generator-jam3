'use strict';
var yeoman = require('yeoman-generator'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  gitOrigin = require('git-origin-url'),
  prompts = require('./prompts'),
  gruntTasks = require('./gruntTasks'),
  createSectionFromRoutes = require('../../lib/generator/createSectionsFromRoutes'),
  createTemplatesFromRoutes = require('../../lib/generator/createTemplatesFromRoutes'),
  createRoutesFromRoutes = require('../../lib/generator/createRoutesFromRoutes'),
  createMainLess = require('../../lib/generator/createMainLess');

var INIT_SECTIONS = ['/'];

function cp(source, dest) {

  dest = dest || source;

  this.fs.copy(

    this.templatePath(source),
    this.destinationPath(dest)
  );
}

function tpl(source, dest, data) {

  if (typeof dest == 'object') {
    data = dest;
    dest = source;
  }

  dest = dest || source;
  data = data || {};

  this.fs.copyTpl(

    this.templatePath(source),
    this.destinationPath(dest),
    data
  );
}

module.exports = yeoman.generators.Base.extend({

  initializing: {

    addTransform: function() {
      var beautify = require('gulp-beautify')({indentSize: 2, preserveNewlines: false});
      var gulpif = require('gulp-if');
      var condition = function(file) {
        return file.path.indexOf('.js')>-1;
      };
      this.registerTransformStream(gulpif(condition,beautify));
    },

    readInProjectName: function() {
      var pathSplit = this.destinationPath().split(path.sep),
        projectName = pathSplit[pathSplit.length - 1];

      this.config.set('projectName', projectName);
    },

    readInRemote: function() {

      var done = this.async();

      gitOrigin(function(err, url) {

        if (!err) {

          this.config.set('projectRepository', url);
        }

        done();
      }.bind(this));
    }

  },

  prompting: {
    promptProjectSettings: function() {

      var done = this.async();

      this.prompt(prompts, function(props) {

        var isDOMBased = props.baseSelector.indexOf('dom') != -1,
          isCanvasBased = props.baseSelector.indexOf('canvas') != -1;

        this.config.set('projectDescription', props.projectDescription);
        this.config.set('projectRepository', props.projectRepository);
        this.config.set('projectAuthorName', props.projectAuthor);
        this.config.set('projectAuthorEmail', props.projectAuthorEmail);
        this.config.set('useTexturePackager', props.useTexturePackager);
        this.config.set('isCanvasBased', isCanvasBased);
        this.config.set('isDOMBased', isDOMBased);
        this.config.set('changeFileNaming', props.changeFileNaming);
        this.config.set('useES6', props.useES6);

        done();
      }.bind(this));
    },

    promptTemplates: function() {

      var done = this.async(),
        config = this.config.getAll(),
        templateChoices = [],
        promptOtherTemplate, templates;

      // This will be a recursive function based on the users answers
      promptOtherTemplate = function() {

        this.prompt([

          {
            type: 'input',
            name: 'otherTemplate',
            message: 'Enter in a file extension you\'d like to use for this other template lib',
            default: '',
            filter: function(val) {
              if (val.charAt(0) == '.') {
                val = val.substring(1);
              }
              return val.toLowerCase();
            }
          }
        ], function(props) {
          this.config.set('templateLibrary', (!props.otherTemplate) ? 'none' : props.otherTemplate);
          done();
        }.bind(this));
      }.bind(this);

      // Build out what templates should be asked for
      if (config.isDOMBased) {

        templateChoices.push('hbs', 'vue');
      }

      if (config.isCanvasBased) {

        templateChoices.push('pixi-ears');
      }

      templateChoices.push('other','none');


      // Ask the questions
      this.prompt([

        {
          type: 'list',
          name: 'templateLibrary',
          message: 'Choose template system',
          choices: templateChoices,
          default: []
        }
      ], function(props) {
        if (props.templateLibrary==='other') {
          promptOtherTemplate();
        } else {
          this.config.set('templateLibrary', props.templateLibrary);
          done();
        }
      }.bind(this));
    }
  },

  configuring: {


  },

  writing: {

    root: function() {

      var copy = cp.bind(this),
        template = tpl.bind(this),
        config = this.config.getAll();

      // copy stuff
      copy('.gitignore');
      copy('.editorconfig');
      copy('.jshintrc');

      template('index.js',config);

      copy('_Gruntfile.js', 'Gruntfile.js');

      // template stuff
      template('package.json', config);
      template('README.md', config);

      this.mkdir('tasks');
      this.mkdir('test');
    },


    grunt: function() {
      var copy = cp.bind(this);

      this.gruntfile.insertVariable('loader', 'require("load-grunt-tasks")(grunt)');

      var defaultTasks = [
        'copy:dev',
        'licensechecker',
        'browserify:dev',
        'less:dev',
        'connect',
        'watch'
      ];

      var distTasks = [
        'browserify:dist',
        'pngmin',
        'copy:dist',
        'less:dist',
        'uglify',
        'compress'
      ];

      var lessOutput='';
      var lessPlugins = [
        {name: 'lessPrefixPlugin', content: "new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions', 'Chrome 42', 'Firefox 37', 'iOS 7', 'Safari 5', 'Explorer 8']})"}
      ];

      for (var i=0; i<lessPlugins.length; i++) {
        this.gruntfile.insertVariable(lessPlugins[i].name,lessPlugins[i].content);
        lessOutput += ((i>1) ? ',' : '')+lessPlugins[i].name;
      }

      var babelOptions = "['babelify', {sourceMap: true, whitelist: ['es6.arrowFunctions', 'es6.classes', 'es6.templateLiterals', 'es6.spec.templateLiterals', 'es6.parameters', 'es6.spread', 'es6.blockScoping', 'es6.constants', 'es6.destructuring']}]";
      var babelOutput = "";

      if(this.config.get('useES6')){
        var babelOutput = babelOptions;
      }

      this.gruntfile.insertConfig('config', JSON.stringify(gruntTasks.config));
      this.gruntfile.insertConfig('licensechecker', JSON.stringify(gruntTasks.licensechecker));
      this.gruntfile.insertConfig('less', JSON.stringify(gruntTasks.less).replace(/('|")LESS_PLUGINS('|")/g,'['+lessOutput+']'));
      this.gruntfile.insertConfig('browserify', JSON.stringify(gruntTasks.browserify).replace(/('|")BABEL_OPTIONS('|")/g,babelOutput));
      this.gruntfile.insertConfig('connect', JSON.stringify(gruntTasks.connect));
      this.gruntfile.insertConfig('pngmin', JSON.stringify(gruntTasks.pngmin));
      this.gruntfile.insertConfig('watch', JSON.stringify(gruntTasks.watch));
      this.gruntfile.insertConfig('copy', JSON.stringify(gruntTasks.copy));
      this.gruntfile.insertConfig('uglify', JSON.stringify(gruntTasks.uglify));
      this.gruntfile.insertConfig('compress', JSON.stringify(gruntTasks.compress));

      if (this.config.get('useTexturePackager') === true) {
        // copy('tasks/texturepacker-animation.js');
        copy('tasks/texturepacker.js');
        this.gruntfile.insertConfig('texturepacker', JSON.stringify(gruntTasks.texturepacker));
        this.gruntfile.registerTask('tp', ['texturepacker']);
        defaultTasks.unshift('tp');
        distTasks.unshift('tp');

        this.gruntfile.insertVariable('tasks', 'grunt.loadTasks("tasks")');
      }

      this.gruntfile.registerTask('default', defaultTasks);
      this.gruntfile.registerTask('release', distTasks);

    },

    app: function() {
      var copy = cp.bind(this),
        template = tpl.bind(this),
        config = this.config.getAll();
      template('release/index.html', 'app/index.html', config);
      template('humans.txt', 'app/humans.txt', config);
      copy('.htaccess', 'app/.htaccess');
      copy('robots.txt', 'app/robots.txt');
    },

    assets: function() {
      var copy = cp.bind(this);

      this.mkdir('raw-assets/json');
      this.mkdir('raw-assets/images');
      this.mkdir('raw-assets/videos');
      this.mkdir('raw-assets/sounds');
      this.mkdir('raw-assets/fonts');

      copy('assets/json/**/*','raw-assets/json');
      copy('assets/images/**/*','raw-assets/images');
      copy('assets/videos/**/*','raw-assets/videos');
      copy('assets/sounds/**/*','raw-assets/sounds');
      copy('assets/fonts/**/*','raw-assets/fonts');


      if (this.config.get('useTexturePackager') === true) {
        this.mkdir('raw-assets/tp');
        this.mkdir('raw-assets/tp/common');

        var copy = cp.bind(this);
        copy('assets/tp/common.tps','raw-assets/tp/common.tps');
      }
    },

    lib: function() {

      var copy = cp.bind(this),
        template = tpl.bind(this),
        config = this.config.getAll();

      template('framework/index.js', 'lib/framework/index.js', config);
      createRoutesFromRoutes.call(this, INIT_SECTIONS);
    },

    model: function() {

      this.fs.copyTpl(

        this.templatePath('../../../templates/model/index.js'),
        this.destinationPath('lib/model/index.js'),
        INIT_SECTIONS, {
          variable: 'data'
        }
      );
    },

    less: function() {
      var copy = cp.bind(this),
        template = tpl.bind(this),
        config = this.config.getAll();

      copy('less/normalize.less', 'lib/less/normalize.less');
      copy('less/vars.less', 'lib/less/vars.less');
      copy('less/global.less', 'lib/less/global.less');
      copy('less/fonts.less', 'lib/less/fonts.less');
    },

    templates: function() {

      createTemplatesFromRoutes.call(this, INIT_SECTIONS.concat('Preloader'), this.config.get('templateLibrary'));
    },

    sections: function() {

      createSectionFromRoutes.call(this, INIT_SECTIONS.concat('Preloader'), this.config.get('templateLibrary'));

    },

    ui: function() {

      if (!fs.existsSync(this.destinationPath('lib/'))) {

        fs.mkdirSync(this.destinationPath('lib/'));
      }

      if (!fs.existsSync(this.destinationPath('lib/ui/'))) {

        fs.mkdirSync(this.destinationPath('lib/ui/'));
      }

    }
  },

  install: function() {
    this.npmInstall();
  },

  end: function() {
    createMainLess.call(this,this.async());
  }

});

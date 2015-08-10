'use strict';
var yeoman = require('yeoman-generator'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  gitOrigin = require('git-origin-url'),
  sectionFromRoute = require('../../lib/sectionFromRoute'),
  prompts = require('./prompts'),
  gruntTasks = require('./gruntTasks'),
  createSectionFromRoutes = require('../../lib/generator/createSectionsFromRoutes'),
  createTemplatesFromRoutes = require('../../lib/generator/createTemplatesFromRoutes'),
  createRoutesFromRoutes = require('../../lib/generator/createRoutesFromRoutes'),
  beautify = require('js-beautify').js_beautify;

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
        this.config.set('useBower', props.useBower);
        this.config.set('useTexturePackager', props.useTexturePackager);
        this.config.set('isCanvasBased', isCanvasBased);
        this.config.set('isDOMBased', isDOMBased);

        // var threejs = (props.extraLibraries.indexOf('threejs') != -1) ? true : false;
        // this.config.set( 'threejs', threejs );
        // var pixi = (props.extraLibraries.indexOf('pixi') != -1) ? true : false;
        // this.config.set( 'pixi', pixi );
        // var gsap = (props.extraLibraries.indexOf('gsap') != -1) ? true : false;
        // this.config.set( 'gsap', gsap );

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

          if (props.otherTemplate != '') {

            if (!_.contains(templates, props.otherTemplate)) {

              templates.push(props.otherTemplate);
            }

            promptOtherTemplate();
          } else {

            this.config.set('templateLibraries', templates);
            done();
          }
        }.bind(this));
      }.bind(this);

      // Build out what templates should be asked for
      if (config.isDOMBased) {

        templateChoices.push('hbs', 'vue');
      }

      if (config.isCanvasBased) {

        templateChoices.push('pixi-ears');
      }

      templateChoices.push('other');


      // Ask the questions
      this.prompt([

        {
          type: 'checkbox',
          name: 'templateLibraries',
          message: 'Choose template system',
          choices: templateChoices,
          default: []
        }
      ], function(props) {

        var hadOther = false;

        templates = props.templateLibraries || [];
        templates = _.remove(templates, function(val) {

          hadOther = hadOther || val == 'other';
          return val != 'other'
        });

        if (hadOther) {

          promptOtherTemplate();
        } else {

          this.config.set('templateLibraries', templates);
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

      if (this.config.get('useBower')) {
        copy('bower.json');
      }

      copy('index.js');

      copy('_Gruntfile.js', 'Gruntfile.js');

      // template stuff
      template('package.json', config);
      template('README.md', config);

      this.mkdir('tasks');
      this.mkdir('test');
    },


    grunt: function() {
      var copy = cp.bind(this);

      // This has to be hooked in here, before any access to this.gruntfile
      // Since this hook is generated any time this.gruntfile is accessed, in node_modules/yeaoman-generator/lib/base.js
      // We are beautifying the Gruntfile.js output to corect the tabs
      this.env.runLoop.add('writing', function (done) {
        this.fs.write(
          this.destinationPath('Gruntfile.js'),
          beautify(this.env.gruntfile.toString(), { indent_size: 2 })
        );
        done();
      }.bind(this), { once: 'gruntfile:write' });

      this.gruntfile.insertVariable('loader', 'require("load-grunt-tasks")(grunt)');

      var defaultTasks = [
        'copy:dev',
        'licensechecker',
        'newer:browserify:dev',
        'newer:less:dev',
        'connect',
        'watch'
      ];

      var distTasks = [
        'browserify:dist',
        'pngmin',
        'copy:dist',
        'less:dist',
        'uglify'
      ];

      var lessOutput='';
      var lessPlugins = [
        {name: 'lessPrefixPlugin', content: "new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions', 'Chrome 42', 'Firefox 37', 'iOS 7', 'Safari 5', 'Explorer 8']})"}
      ]

      for (var i=0; i<lessPlugins.length; i++) {
        this.gruntfile.insertVariable(lessPlugins[i].name,lessPlugins[i].content);
        lessOutput += ((i>1) ? ',' : '')+lessPlugins[i].name;
      }


      this.gruntfile.insertConfig('config', JSON.stringify(gruntTasks.config));
      this.gruntfile.insertConfig('licensechecker', JSON.stringify(gruntTasks.licensechecker));
      this.gruntfile.insertConfig('less', JSON.stringify(gruntTasks.less).replace(/('|")LESS_PLUGINS('|")/g,'['+lessOutput+']'));
      this.gruntfile.insertConfig('browserify', JSON.stringify(gruntTasks.browserify));
      this.gruntfile.insertConfig('connect', JSON.stringify(gruntTasks.connect));
      this.gruntfile.insertConfig('pngmin', JSON.stringify(gruntTasks.pngmin));
      this.gruntfile.insertConfig('watch', JSON.stringify(gruntTasks.watch));
      this.gruntfile.insertConfig('copy', JSON.stringify(gruntTasks.copy));
      this.gruntfile.insertConfig('uglify', JSON.stringify(gruntTasks.uglify));

      if (this.config.get('useBower') === true) {
        this.gruntfile.insertConfig('concat', JSON.stringify(gruntTasks.concat));
        this.gruntfile.loadNpmTasks('grunt-contrib-concat');
        defaultTasks.splice(defaultTasks.indexOf('newer:browserify:dev'), 0, 'concat:dev');
        distTasks.splice(distTasks.indexOf('browserify:dist'), 0, 'concat:dist');
      }

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
      copy('humans.txt', 'app/humans.txt');
    },

    assets: function() {
      this.mkdir('raw-assets/json');
      this.mkdir('raw-assets/images');
      this.mkdir('raw-assets/videos');
      this.mkdir('raw-assets/sounds');
      this.mkdir('raw-assets/fonts');

      if (this.config.get('useTexturePackager') === true) {
        this.mkdir('raw-assets/tp');
        this.mkdir('raw-assets/tp/common');

        var copy = cp.bind(this);
        copy('assets/tp/common.tps','raw-assets/tp/common.tps');
      }
    },

    lib: function() {

      var copy = cp.bind(this),
        template = tpl.bind(this);

      copy('framework/index.js', 'lib/framework/index.js');
      createRoutesFromRoutes.call(this, INIT_SECTIONS);
    },

    model: function() {

      var model = {};

      INIT_SECTIONS.forEach(function(section) {

        model[section] = {};
      });

      this.fs.copyTpl(

        this.templatePath('../../../templates/model/index.js'),
        this.destinationPath('lib/model/index.js'),
        model, {
          variable: 'data'
        }
      );
    },

    less: function() {
      var copy = cp.bind(this),
        template = tpl.bind(this);

      copy('less/normalize.less', 'lib/less/normalize.less');
      copy('less/vars.less', 'lib/less/vars.less');
      copy('less/global.less', 'lib/less/global.less');
      copy('less/fonts.less', 'lib/less/fonts.less');
      copy('less/main.less', 'lib/less/main.less');

    },

    templates: function() {

      createTemplatesFromRoutes.call(this, INIT_SECTIONS.concat('Preloader'), this.config.get('templateLibraries'));
    },

    sections: function() {

      createSectionFromRoutes.call(this, INIT_SECTIONS.concat('Preloader'), this.config.get('templateLibraries'));
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

    this.installDependencies();
  }

});

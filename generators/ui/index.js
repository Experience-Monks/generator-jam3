'use strict';
var yeoman = require('yeoman-generator'),
  chalk = require( 'chalk' ),
  fs = require( 'fs' ),
  createSectionFromRoutes = require('../../lib/generator/createSectionsFromRoutes'),
  createTemplatesFromRoutes = require('../../lib/generator/createTemplatesFromRoutes'),
  createMainLess = require('../../lib/generator/createMainLess');

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

    checkInit: function() {
      var config = this.config.getAll();

      try {
        // check if it exists it will throw an err if it doesnt
        // add a pull request for an exists function
        this.fs.read( this.destinationPath( '/lib/model/index.js' ) )

        this.model = require( this.destinationPath( '/lib/model/index.js' ) );
      } catch( e ) {

        this.model = null;
      }

      this.isInited = config.projectName !== undefined && this.model !== null;

      if( !this.isInited ) {
        this.log( chalk.red.bold( 'It seems you haven\'t initialized the project. Call `yo jam3` to get going' ) );
      } else {
        this.routes = [];

        for( var i in this.model ) {

          if( i.charAt( 0 ) == '/' ) {

            this.routes.push( i );
          }
        }
      }
    }
  },

  prompting: function() {
    var done = this.async();
    var choices = [{
      name: "common",
      value: "common",
      checked: true
    },
    {
      name: "Preloader",
      value: "Preloader"
    }];
    this.routes.map(function(cur) {
      var name = cur==='/' ? 'Landing' : cur.substr(1);
      choices.push({name: name, value: name});
    });

    var prompts = [
    {
        name: 'uiName',
        message: 'Name your UI element:'
    },
    {
        type: 'list',
        name: 'section',
        message: 'Which section?',
        choices: choices
    }
    ];
    this.prompt(prompts, function (props) {
      this.uiName = props.uiName;
      this.uiSection = props.section || 'common';

      var uiDir = 'lib/ui/'+this.uiSection+'/';
      if (!fs.existsSync(this.destinationPath(uiDir))) {
        fs.mkdirSync(this.destinationPath(uiDir));
      }


      if (!this.uiName || !this.uiSection) {
        this.log( chalk.red.bold( 'You must specify a name and a section.' ) );
      } else {
        done();
      }
    }.bind(this));
  },

  writing: {
    ui: function() {
      createTemplatesFromRoutes.call(this, [this.uiName], this.config.get('templateLibraries'), this.uiSection);
      createSectionFromRoutes.call(this, [this.uiName], this.config.get('templateLibraries'), this.uiSection);
    }
  },
  end: function() {
    createMainLess.call(this,this.async());
  }
});

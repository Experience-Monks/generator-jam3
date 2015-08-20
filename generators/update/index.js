'use strict';
var yeoman = require('yeoman-generator'),
  chalk = require( 'chalk' ),
  fs = require( 'fs' ),
  createSectionsFromRoutes = require( '../../lib/generator/createSectionsFromRoutes' ),
  createTemplatesFromRoutes = require( '../../lib/generator/createTemplatesFromRoutes' ),
  createRoutesFromRoutes = require( '../../lib/generator/createRoutesFromRoutes' ),
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

  writing: {

    routes: function() {

      if( this.isInited ) {

        createRoutesFromRoutes.call( this, this.routes );
      }
    },

    sections: function() {

      var config = this.config.getAll();

      if( this.isInited ) {

        createSectionsFromRoutes.call( this, this.routes, config.templateLibraries );

      }
    },

    templates: function() {

      var config = this.config.getAll();

      if( this.isInited ) {

        createTemplatesFromRoutes.call( this, this.routes, config.templateLibraries );
      }
    },
  },
  end: function() {
    createMainLess.call(this,this.async());
  }
});

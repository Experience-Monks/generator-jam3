'use strict';
var yeoman = require('yeoman-generator'),
	fs = require( 'fs' ),
	path = require( 'path' ),
	sectionFromRoute = require( '../../lib/sectionFromRoute' ),
	prompts = require( '../../lib/prompts' ),
	createSectionFromRoutes = require( '../../lib/generator/createSectionsFromRoutes' ),
	createTemplatesFromRoutes = require( '../../lib/generator/createTemplatesFromRoutes' );

var INIT_SECTIONS = [ '/' ];

function cp( source, dest ) {

	dest = dest || source;

	this.fs.copy( 

		this.templatePath( source ),
		this.destinationPath( dest )
	);
}

function tpl( source, dest, data ) {

	if( typeof dest == 'object' ) {

		data = dest;
		dest = source;
	}

	dest = dest || source;
	data = data || {};

	this.fs.copyTpl( 

		this.templatePath( source ),
		this.destinationPath( dest ),
		data
	);
}

module.exports = yeoman.generators.Base.extend({

	initializing: {

	},

	prompting: {
		askFor: function () {
		    var done = this.async();

		    this.prompt(prompts, function (props) {
		    	
		      this.config.set( 'projectName', props.projectName );
		      this.config.set( 'projectDescription', props.projectDescription );
		      this.config.set( 'projectRepository', props.projectRepository );
		      this.config.set( 'projectAuthorName', props.projectAuthor );
		      this.config.set( 'projectAuthorEmail', props.projectAuthorEmail );
		      this.config.set( 'useBower', props.useBower );
		      this.config.set( 'useTexturePackager', props.useTexturePackager );
		      this.config.set( 'isCanvasProject', props.isCanvasProject );
		      this.config.set( 'templateLibrary', props.templateLibrary );

		      var threejs = (props.extraLibraries.indexOf('threejs') != -1) ? true : false;
		      this.config.set( 'threejs', threejs );
		      var pixi = (props.extraLibraries.indexOf('pixi') != -1) ? true : false;
		      this.config.set( 'pixi', pixi );
		      var hammerjs = (props.extraLibraries.indexOf('hammerjs') != -1) ? true : false;
		      this.config.set( 'hammerjs', hammerjs );
		      var gsap = (props.extraLibraries.indexOf('gsap') != -1) ? true : false;
		      this.config.set( 'gsap', gsap );

		      done();
		    }.bind(this));
		  }
	},

	configuring: {

		readInProjectName: function() {

			var pathSplit = this.destinationPath().split( path.sep ),
				projectName = pathSplit[ pathSplit.length - 1 ];

			this.config.set( 'projectName', projectName );
		}
	},

	writing: {

		root: function() {

			var copy = cp.bind( this ),
				template = tpl.bind( this ),
				config = this.config.getAll();

			// copy stuff
			copy( '.editorconfig' );
			copy( '.jshintrc' );

			if(this.config.get('useBower')) {
				copy( 'bower.json' );
			}
			
			copy( 'index.js' );

			// template stuff
			template( 'package.json', config );
			template( 'README.md', config );
		},

		lib: function() {

			var copy = cp.bind( this ),
				template = tpl.bind( this );

			copy( 'framework/index.js', 'lib/framework/index.js' );
			copy( 'framework/routes.js', 'lib/framework/routes.js' );
		},

		model: function() {

			var model = {};

			INIT_SECTIONS.forEach( function( section ) {

				model[ section ] = {};
			});
			
			this.fs.copyTpl( 

				this.templatePath( '../../../templates/model/index.js' ),
				this.destinationPath( 'lib/model/index.js' ),
				model,
				{ variable: 'data' }
			);
		},

		templates: function() {

			createTemplatesFromRoutes.call( this, INIT_SECTIONS, [ 'hbs', 'ear' ] );
		},

		sections: function() {

			createSectionFromRoutes.call( this, INIT_SECTIONS );
		},

		ui: function() {

			if( !fs.existsSync( this.destinationPath( 'lib/' ) ) ) {

				fs.mkdirSync( this.destinationPath( 'lib/' ) );
			}

			if( !fs.existsSync( this.destinationPath( 'lib/ui/' ) ) ) {

				fs.mkdirSync( this.destinationPath( 'lib/ui/' ) );
			}

			INIT_SECTIONS.forEach( function( route ) {

				var fileName = sectionFromRoute( route );

				if( !fs.existsSync( this.destinationPath( 'lib/ui/' + fileName ) ) ) {

					fs.mkdirSync( this.destinationPath( 'lib/ui/' + fileName ) );
				}
			}.bind( this ));						
		}	
	}
});
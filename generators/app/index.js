'use strict';
var yeoman = require('yeoman-generator'),
	fs = require( 'fs' ),
	path = require( 'path' ),
	gitOrigin = require( 'git-origin-url' ),
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

		readInProjectName: function() {

			var pathSplit = this.destinationPath().split( path.sep ),
				projectName = pathSplit[ pathSplit.length - 1 ];

			this.config.set( 'projectName', projectName );
		},

		readInRemote: function() {

			var done = this.async();

			git( function( err, url ) {

				if( !err ) {

					this.config.set( 'projectRepository', url );
				} 
			});
		}
	},

	prompting: {
		askFor: function () {
		    var done = this.async();

		    this.prompt(prompts, function (props) {
		    	
		      this.config.set( 'projectDescription', props.projectDescription );
		      this.config.set( 'projectRepository', props.projectRepository );
		      this.config.set( 'projectAuthorName', props.projectAuthor );
		      this.config.set( 'projectAuthorEmail', props.projectAuthorEmail );
		      this.config.set( 'useBower', props.useBower );
		      this.config.set( 'useTexturePackager', props.useTexturePackager );
		      this.config.set( 'templateLibrary', props.templateLibrary );

		      var isDOMBased = (props.baseSelector.indexOf('dom') != -1) ? true : false;
		      var isCanvasBased = (props.baseSelector.indexOf('canvas') != -1) ? true : false;

		      this.config.set( 'isCanvasBased', isCanvasBased );
		      this.config.set( 'isDOMBased', isDOMBased );

		      var threejs = (props.extraLibraries.indexOf('threejs') != -1) ? true : false;
		      this.config.set( 'threejs', threejs );
		      var pixi = (props.extraLibraries.indexOf('pixi') != -1) ? true : false;
		      this.config.set( 'pixi', pixi );
		      var gsap = (props.extraLibraries.indexOf('gsap') != -1) ? true : false;
		      this.config.set( 'gsap', gsap );

		      done();
		    }.bind(this));
		  }
	},

	configuring: {

		
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

			this.mkdir('tasks');
			this.mkdir('test');
		},


		grunt: function() {
			this.template( 'Gruntfile.js' );
		},

		app: function() {
			var copy = cp.bind( this ),
				template = tpl.bind( this ),
				config = this.config.getAll();

			this.mkdir('app/assets/json');
			this.mkdir('app/assets/images');
			this.mkdir('app/assets/videos');
			this.mkdir('app/assets/sounds');
			this.mkdir('app/assets/fonts');

			template( 'app/index.html', config);
			//this.template( 'app/index.html');
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

		less: function() {
			var copy = cp.bind( this ),
				template = tpl.bind( this );

			copy( 'less/normalize.less', 'lib/less/normalize.less' );
			copy( 'less/global.less', 'lib/less/global.less' );
			copy( 'less/fonts.less', 'lib/less/fonts.less' );
			copy( 'less/main.less', 'lib/less/main.less' );

			copy( 'less/sections/Landing/index.less', 'lib/less/sections/Landing/index.less' );
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
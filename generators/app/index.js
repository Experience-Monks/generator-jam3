'use strict';
var yeoman = require('yeoman-generator'),
	fs = require( 'fs' ),
	path = require( 'path' ),
	_ = require( 'lodash' ),
	gitOrigin = require( 'git-origin-url' ),
	sectionFromRoute = require( '../../lib/sectionFromRoute' ),
	prompts = require( './prompts' ),
	gruntTasks = require( './gruntTasks' ),
	createSectionFromRoutes = require( '../../lib/generator/createSectionsFromRoutes' ),
	createTemplatesFromRoutes = require( '../../lib/generator/createTemplatesFromRoutes' ),
	createRoutesFromRoutes = require( '../../lib/generator/createRoutesFromRoutes' );

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

			gitOrigin( function( err, url ) {

				if( !err ) {

					this.config.set( 'projectRepository', url );
				} 

				done();
			}.bind(this));
		}
	},

	prompting: {
		promptProjectSettings: function () {

			var done = this.async();

			this.prompt(prompts, function (props) {

				var isDOMBased = props.baseSelector.indexOf('dom') != -1,
					isCanvasBased = props.baseSelector.indexOf('canvas') != -1;

				this.config.set( 'projectDescription', props.projectDescription );
				this.config.set( 'projectRepository', props.projectRepository );
				this.config.set( 'projectAuthorName', props.projectAuthor );
				this.config.set( 'projectAuthorEmail', props.projectAuthorEmail );
				this.config.set( 'useBower', props.useBower );
				this.config.set( 'useTexturePackager', props.useTexturePackager );
				this.config.set( 'isCanvasBased', isCanvasBased );
				this.config.set( 'isDOMBased', isDOMBased );
			
				

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

				this.prompt( [ 

					{
						type: 'input',
						name: 'otherTemplate',
						message: 'Enter in a file extension you\'d like to use for this other template lib',
						default: '',
						filter: function( val ) { 

							if( val.charAt( 0 ) == '.' ) {

								val = val.substring( 1 );
							}

							return val.toLowerCase(); 
						}
					}
				], function (props) {

					if( props.otherTemplate != '' ) {

						if( !_.contains(templates, props.otherTemplate) ) {

							templates.push( props.otherTemplate );	
						}
						
						promptOtherTemplate();
					} else {

						this.config.set( 'templateLibraries', templates );
						done();
					}
				}.bind( this ));
			}.bind( this );

			// Build out what templates should be asked for
			if( config.isDOMBased ) {

				templateChoices.push( 'hbs', 'vue' );
			}

			if( config.isCanvasBased ) {

				templateChoices.push( 'pixi-ears' );
			}

			templateChoices.push( 'other' );			
			

			// Ask the questions
			this.prompt( [ 

				{
					type: 'checkbox',
					name: 'templateLibraries',
					message: 'Choose template system',
					choices: templateChoices,
					default: []
				}
			], function (props) {

				var hadOther = false;

				templates = props.templateLibraries || [];
				templates = _.remove( templates, function ( val ) { 

					hadOther = hadOther || val == 'other'; 
					return val != 'other'
				});

				if( hadOther ) {

					promptOtherTemplate();
				} else {

					this.config.set( 'templateLibraries', templates );
					done();
				}
			}.bind( this ));
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
			var copy = cp.bind( this );

			this.gruntfile.insertVariable('loader', 'require("load-grunt-tasks")(grunt)');

		    var defaultTasks = [
		        'licensechecker',
		        'newer:browserify:dev',
		        'newer:less:dev',
		        'connect',
		        'watch'
		    ];

		    var distTasks = [
		        'browserify:dist',
		        'images',
		        'copy:json',
		        'copy:html',
		        'less:dist',
		        'pngmin'
		    ];

			this.gruntfile.insertConfig('config', JSON.stringify(gruntTasks.config));
			this.gruntfile.insertConfig('licensechecker', JSON.stringify(gruntTasks.licensechecker));
			this.gruntfile.insertConfig('less', JSON.stringify(gruntTasks.less));
			this.gruntfile.insertConfig('browserify', JSON.stringify(gruntTasks.browserify));
			this.gruntfile.insertConfig('connect', JSON.stringify(gruntTasks.connect));
			this.gruntfile.insertConfig('pngmin', JSON.stringify(gruntTasks.pngmin));
			this.gruntfile.insertConfig('watch', JSON.stringify(gruntTasks.watch));
			this.gruntfile.insertConfig('copy', JSON.stringify(gruntTasks.copy));

			if(this.config.get('useBower') === true) {
				this.gruntfile.insertConfig('concat', JSON.stringify(gruntTasks.concat));
				this.gruntfile.loadNpmTasks( 'grunt-contrib-concat' );
				defaultTasks.splice(defaultTasks.indexOf('newer:browserify:dev'), 0, 'concat:dev');
				distTasks.splice(distTasks.indexOf('browserify:dist'), 0, 'concat:dist');
			}

			// if(this.config.get('useTexturePackager') === true) {
			// 	copy('tasks/texturepacker-animation.js');
			// 	copy('tasks/texturepacker.js');
			// 	this.gruntfile.insertConfig('texturepacker', JSON.stringify(gruntTasks.texturepacker));
			// 	this.gruntfile.registerTask('tp', ['texturepacker']);
			// 	defaultTasks.unshift('tp');
			// 	distTasks.unshift('tp');

			// 	this.gruntfile.insertVariable('tasks', 'grunt.loadTasks("tasks")');
			// }

		    this.gruntfile.registerTask('images', ['copy:images','pngmin']);

		    this.gruntfile.registerTask('default', defaultTasks);
		    this.gruntfile.registerTask('release', distTasks);
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
			// if(this.config.get('useTexturePackager') === true) {
			// 	this.mkdir('app/assets/tp');
			// }

			template( 'app/index.html', config);
		},

		temp: function() {
			var copy = cp.bind( this ),
				template = tpl.bind( this ),
				config = this.config.getAll();

			this.mkdir('.tmp/assets/json');
			this.mkdir('.tmp/assets/images');
			this.mkdir('.tmp/assets/videos');
			this.mkdir('.tmp/assets/sounds');
			this.mkdir('.tmp/assets/fonts');
			// if(this.config.get('useTexturePackager') === true) {
			// 	this.mkdir('app/assets/tp');
			// }

			template( 'app/index.html', '.tmp/index.html', config);
		},

		assets: function() {
			this.mkdir('assets/json');
			this.mkdir('assets/images');
			this.mkdir('assets/videos');
			this.mkdir('assets/sounds');
			this.mkdir('assets/fonts');

			// if(this.config.get('useTexturePackager') === true) {
			// 	this.mkdir('assets/tp');
			// }
		},

		lib: function() {

			var copy = cp.bind( this ),
				template = tpl.bind( this );

			copy( 'framework/index.js', 'lib/framework/index.js' );
			createRoutesFromRoutes.call( this, INIT_SECTIONS );
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

			createTemplatesFromRoutes.call(this, INIT_SECTIONS, this.config.get( 'templateLibraries' ));
		},

		sections: function() {

			createSectionFromRoutes.call( this, INIT_SECTIONS, this.config.get( 'templateLibraries' ));
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
	},

	install: function() {

		this.installDependencies();
	}
});
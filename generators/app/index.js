'use strict';
var yeoman = require('yeoman-generator'),
	string = require( 'string' );

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
		
	},

	writing: {

		root: function() {

			var copy = cp.bind( this ),
				template = tpl.bind( this );

			// copy stuff
			copy( '.editorconfig' );
			copy( '.jshintrc' );
			copy( 'bower.json' );
			copy( 'package.json' );
			copy( 'index.js' );

			// template stuff
			template( 'README.md', { projectName: 'Special Project' } );
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

			this.fs.copyTpl( 

				this.templatePath( '../../../templates/templates/index.js' ),
				this.destinationPath( 'lib/templates/index.js' ),
				{ 
					sections: INIT_SECTIONS,
					templates: [ 'hbs', 'ear' ]
				}
			);
		},

		sections: function() {

			INIT_SECTIONS.forEach( function( section ) {

				var sectionsSplit = section.split( '/' ),
					fileName = [], firstChar;

				// grab all parts of the file name
				for( var i = 0, len = sectionsSplit.length; i < len; i++ ) {

					firstChar = sectionsSplit[ i ].charAt( 0 );

					if( firstChar == ':' || firstChar == '*' ) {

						break;
					} else{

						fileName.push( sectionsSplit[ i ] );
					}
				}

				fileName.forEach( function( part, idx, fileName ) {

					fileName[ idx ] = string( part ).capitalize().s;
				});

				fileName = fileName.join( '' );

				if( fileName == '' )  {

					fileName = 'Landing';
				}


				this.fs.copyTpl( 

					this.templatePath( '../../../templates/sections/index.js' ),
					this.destinationPath( 'lib/sections/' + fileName + '.js' ),
					{ section: fileName }
				);
			}.bind( this ));
		}	
	}
});
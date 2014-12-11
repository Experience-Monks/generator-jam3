'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

	initializing: {

	},

	prompting: {
		
	},

	writing: {

		root: function() {

			var copy = function( name ) {

				this.fs.copy( 

					this.templatePath( name ),
					this.destinationPath( name )
				);
			}.bind( this );

			// copy stuff
			copy( '.editorconfig' );
			copy( '.jshintrc' );
			copy( 'bower.json' );
			copy( 'package.json' );
			copy( 'index.js' );

			// template stuff
			this.fs.copyTpl( 

				this.templatePath( 'README.md' ),
				this.destinationPath( 'README.md' ),
				{ projectName: 'Special Project' }
			);
		}
	}
});
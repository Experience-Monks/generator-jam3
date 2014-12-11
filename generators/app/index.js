'use strict';
var yeoman = require('yeoman-generator');

function cp( source, dest ) {

	dest = dest || source;

	this.fs.copy( 

		this.templatePath( source ),
		this.destinationPath( dest )
	);
}

module.exports = yeoman.generators.Base.extend({

	initializing: {

	},

	prompting: {
		
	},

	writing: {

		root: function() {

			var copy = cp.bind( this );

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
		},

		lib: function() {

			var copy = cp.bind( this );

			copy( 'framework/index.js', 'lib/framework/index.js' );
			copy( 'framework/routes.js', 'lib/framework/routes.js' );
		}
	}
});
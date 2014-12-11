'use strict';
var yeoman = require('yeoman-generator');

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
			
			var copy = cp.bind( this ),
				template = tpl.bind( this );

			this.fs.copyTpl( 

				this.templatePath( '../../../templates/model/index.js' ),
				this.destinationPath( 'lib/model/index.js' ),
				{ '/': {} },
				{ variable: 'data' }
			);
		},

		templates: function() {

		}
	}
});
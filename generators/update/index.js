'use strict';
var yeoman = require('yeoman-generator'),
	chalk = require( 'chalk' ),
	fs = require( 'fs' ),
	createSectionsFromRoutes = require( '../../lib/generator/createSectionsFromRoutes' ),
	createTemplatesFromRoutes = require( '../../lib/generator/createTemplatesFromRoutes' );

module.exports = yeoman.generators.Base.extend({

	initializing: {

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

		sections: function() {

			if( this.isInited ) {

				createSectionsFromRoutes.call( this, this.routes );
			}
		},

		templates: function() {

			var config = this.config.getAll();

			if( this.isInited ) {

				createTemplatesFromRoutes.call( this, this.routes, config.templateLibraries );
			}
		}
	}
});
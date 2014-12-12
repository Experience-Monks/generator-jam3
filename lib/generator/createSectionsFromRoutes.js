var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes ) {

	routes.forEach( function( route ) {

		var fileName = sectionFromRoute( route );

		try {

			// this will throw an error if it doesn't exist
			// i've created a pull request for this for yoman
			this.fs.read( this.destinationPath( 'lib/sections/' + fileName + '.js' ) );
		} catch( e ) {

			this.fs.copyTpl( 

				this.templatePath( '../../../templates/sections/index.js' ),
				this.destinationPath( 'lib/sections/' + fileName + '.js' ),
				{ section: fileName }
			);
		}
	}.bind( this ));
};
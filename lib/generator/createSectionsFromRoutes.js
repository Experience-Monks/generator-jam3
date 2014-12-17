var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes, templateTypes ) {

	routes.forEach( function( route ) {

		var fileName = sectionFromRoute( route ),
			filePath = this.destinationPath( 'lib/sections/' + fileName + '/index.js' );

		try {

			// this will throw an error if it doesn't exist
			// i've created a pull request for this for yeoman
			this.fs.read( filePath );
		} catch( e ) {

			this.fs.copyTpl( 

				this.templatePath( '../../../templates/sections/index.js' ),
				filePath,
				{ section: fileName, templateTypes: templateTypes }
			);
		}
	}.bind( this ));
};
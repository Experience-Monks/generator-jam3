var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes, templateTypes ) {

	routes.forEach( function( route ) {

		templateTypes.forEach( function( extension ) {

			if( extension.charAt( 0 ) != '.' )
				extension = '.' + extension;

			var baseName = sectionFromRoute( route ),
				fileName = baseName + extension,
				templateFilePath = this.destinationPath( 'lib/sections/' + baseName + '/' + fileName );

			// this is the only way to check if a file exists currently
			// a pull request is waiting
			try {

				this.fs.read( templateFilePath );
			} catch( e ) {

				this.fs.write( templateFilePath, '' );
			}
		}.bind( this ));
	}.bind( this ));
};
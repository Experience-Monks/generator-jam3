var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes, templateTypes ) {

	this.fs.copyTpl( 

		this.templatePath( '../../../templates/templates/index.js' ),
		this.destinationPath( 'lib/templates/index.js' ),
		{ 
			sections: routes,
			templates: templateTypes
		}
	);

	routes.forEach( function( route ) {

		templateTypes.forEach( function( extension ) {

			if( extension.charAt( 0 ) != '.' )
				extension = '.' + extension;

			var fileName = sectionFromRoute( route ) + extension,
				templateFilePath = this.destinationPath( 'lib/templates/' + fileName );

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
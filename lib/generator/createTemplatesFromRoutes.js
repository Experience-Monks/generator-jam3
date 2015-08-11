var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes, templateTypes ) {

	routes.forEach( function( route ) {

		templateTypes.forEach( function( extension ) {

			if( extension.charAt( 0 ) != '.' )
				extension = '.' + extension;

			var baseName = sectionFromRoute( route ),
				fileName = ((this.config.get('changeFileNaming')) ? baseName + '.template' + extension : 'template' + extension),
				templateFilePath = this.destinationPath( 'lib/sections/' + baseName + '/' + fileName );

			// this is the only way to check if a file exists currently
			// a pull request is waiting
			if (!this.fs.exists(templateFilePath)) {
				this.fs.write( templateFilePath, '<div id="'+baseName+'"></div>' );
			}
		}.bind( this ));
	}.bind( this ));
};

var sectionFromRoute = require( '../sectionFromRoute' );
var fs = require('fs');

module.exports = function( routes, templateTypes ) {

	routes.forEach( function( route ) {

		var fileName = sectionFromRoute( route ),
			filePath = this.destinationPath( 'lib/sections/' + fileName + '/index.js' ),
			lessPath = this.destinationPath( 'lib/less/sections/' + fileName + '/index.less' ),
			uiPath = this.destinationPath( 'lib/ui/'+fileName+'/.gitkeep' );

		if (!this.fs.exists(filePath)) {
			this.fs.copyTpl( 
				this.templatePath( '../../../templates/sections/index.js' ),
				filePath,
				{ section: fileName, templateTypes: templateTypes }
			);
		}
		this.fs.write(lessPath,'');
		this.fs.write(uiPath,'');
	}.bind( this ));
};
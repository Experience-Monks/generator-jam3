var sectionFromRoute = require( '../sectionFromRoute' );
var fs = require('fs');

module.exports = function( routes, templateTypes, uiPath ) {

	routes.forEach( function( route ) {

		var fileName = sectionFromRoute( route ),
			//this.config.get('projectName')
			//((this.config.get('changeFileNaming')) ? 'lib/sections/' + fileName + '/' + fileName + '.style.less' : 'lib/sections/' + fileName + '/style.less')
      basePath = 'lib/'+((uiPath)?'ui':'sections')+'/' + (uiPath ? uiPath : fileName) + '/' + ((uiPath) ? fileName+'/' : ''),
			filePath = this.destinationPath( basePath + ((this.config.get('changeFileNaming')) ? fileName + '.js' : 'index.js') ),
			lessPath = this.destinationPath( basePath + ((this.config.get('changeFileNaming')) ? fileName + '.style.less' : 'style.less') );

		if (!this.fs.exists(filePath)) {
			this.fs.copyTpl(
				this.templatePath( '../../../templates/sections/index.js' ),
				filePath,
				{ section: fileName, templateTypes: templateTypes, changeFileNaming: this.config.get('changeFileNaming'), useES6: this.config.get('useES6')}
			);
		}
		this.fs.write(lessPath,'');
		if (!uiPath) this.fs.write(this.destinationPath( 'lib/ui/' + fileName + '/.gitkeep' ),'');
	}.bind( this ));
};

var sectionFromRoute = require( '../sectionFromRoute' );
var fs = require('fs');

module.exports = function( routes, templateTypes ) {

	routes.forEach( function( route ) {

		var fileName = sectionFromRoute( route ),
			//this.config.get('projectName')
			//((this.config.get('changeFileNaming')) ? 'lib/sections/' + fileName + '/' + fileName + '.style.less' : 'lib/sections/' + fileName + '/style.less')
			filePath = this.destinationPath( ((this.config.get('changeFileNaming')) ? 'lib/sections/' + fileName + '/' + fileName + '.js' : 'lib/sections/' + fileName + '/index.js') ),
			lessPath = this.destinationPath( ((this.config.get('changeFileNaming')) ? 'lib/sections/' + fileName + '/' + fileName + '.style.less' : 'lib/sections/' + fileName + '/style.less') ),
			uiPath = this.destinationPath( 'lib/ui/' + fileName + '/.gitkeep' );

		if (!this.fs.exists(filePath)) {
			this.fs.copyTpl(
				this.templatePath( '../../../templates/sections/index.js' ),
				filePath,
				{ section: fileName, templateTypes: templateTypes, changeFileNaming: this.config.get('changeFileNaming'), useES6: this.config.get('useES6')}
			);
		}
		this.fs.write(lessPath,'');
		this.fs.write(uiPath,'');
	}.bind( this ));
};

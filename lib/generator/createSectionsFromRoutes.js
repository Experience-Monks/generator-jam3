var sectionFromRoute = require( '../sectionFromRoute' );
var fs = require('fs');

module.exports = function( routes, extension, uiPath ) {

  routes.forEach( function( route ) {

    var fileName = sectionFromRoute( route ),
      basePath = 'lib/'+((uiPath)?'ui':'sections')+'/' + (uiPath ? uiPath : fileName) + '/' + ((uiPath) ? fileName+'/' : ''),
      filePath = this.destinationPath( basePath + ((this.config.get('changeFileNaming')) ? fileName + '.js' : 'index.js') ),
      cssPath = this.destinationPath( basePath + ((this.config.get('changeFileNaming')) ? fileName + '.style.' : 'style.')+this.config.get('css') );

    if (!this.fs.exists(filePath)) {
      var tmpFile = this.templatePath('../../../templates/sections/index.'+extension+'.js');
      if (!this.fs.exists(tmpFile)) tmpFile = this.templatePath('../../../templates/sections/index.js');
      this.fs.copyTpl(
        tmpFile,
        filePath,
        { section: fileName, template: extension, changeFileNaming: this.config.get('changeFileNaming'), useES6: this.config.get('useES6')}
      );
    }
    this.fs.write(cssPath,'');
    if (!uiPath) this.fs.write(this.destinationPath( 'lib/ui/' + fileName + '/.gitkeep' ),'');
  }.bind( this ));
};

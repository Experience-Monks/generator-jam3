var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes ) {

	this.fs.copyTpl( 

		this.templatePath( '../../../templates/framework/routes.js' ),
		this.destinationPath( 'lib/framework/routes.js' ),
		{ routes: routes, changeFileNaming: this.config.get('changeFileNaming') },
		{ imports: {

			sectionFromRoute: sectionFromRoute
		}}
	);
};
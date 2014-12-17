var sectionFromRoute = require( '../sectionFromRoute' );

module.exports = function( routes ) {

	this.fs.copyTpl( 

		this.templatePath( '../../../templates/framework/routes.js' ),
		this.destinationPath( 'lib/framework/routes.js' ),
		{ routes: routes },
		{ imports: {

			sectionFromRoute: sectionFromRoute
		}}
	);
};
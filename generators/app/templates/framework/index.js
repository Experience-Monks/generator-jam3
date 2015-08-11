'use strict';
var bigwheel = require( 'bigwheel' );

module.exports = bigwheel( function( done ) {

	done( {

		initSection: require('../sections/Preloader/<%= ((changeFileNaming) ? "Preloader.js" : "index.js") %>'),

		routes: require( './routes' )
	});
});

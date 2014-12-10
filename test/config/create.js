var test = require( 'prova' ),
	create = require( '../../lib/jam3config/create' );

var intended = {

	'/': {}
};

test( 'config create', function( t ) {

	t.plan( 2 );

	var config = create();

	t.equal( typeof config, 'string', 'Create returned a string' );
	t.equal( config, JSON.stringify( intended, null, '\t' ), 'expected content was correct' );
});
var test = require( 'prova' ),
	parse = require( '../../lib/jam3config/parse' );

var testData = {

	number: 10,
	boolean: true,
	string: 'some string',
	inArray: [

		{ number: 10, string: 'something else' },
		{ number: 12, string: 'again something else' }
	],
	inObject: {

		number: 333,
		boolean: true
	}
};

var intended = {

	number: 'number',
	boolean: 'boolean',
	string: 'string',
	inArray: [

		{ number: 'number', string: 'string' },
		{ number: 'number', string: 'string' }
	],
	inObject: {

		number: 'number',
		boolean: 'boolean'
	}
};

test( 'config parse', function( t ) {

	t.plan( 1 );
	t.equal( JSON.stringify( parse( JSON.stringify( testData ) ) ), JSON.stringify( intended ), 'parse converted and normalized the string' );
});
var test = require( 'prova' ),
	stringify = require( '../../lib/jam3config/stringify' );

var testData = {

	thisIsANumber: 10,
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

	thisIsANumber: 'number',
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

test( 'config stringify', function( t ) {

	t.plan( 1 );
	t.equal( stringify( testData ), JSON.stringify( intended, null, '\t' ), 'stringify converted and normalized the string' );
});
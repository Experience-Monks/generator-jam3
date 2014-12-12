var string = require( 'string' );

module.exports = function sectionFromRoute( route ) {

	var routeSplit = route.split( '/' ),
		sectionName = [], firstChar;

	// grab all parts of the file name
	for( var i = 0, len = routeSplit.length; i < len; i++ ) {

		firstChar = routeSplit[ i ].charAt( 0 );

		if( firstChar == ':' || firstChar == '*' ) {

			break;
		} else{

			sectionName.push( routeSplit[ i ] );
		}
	}

	sectionName.forEach( function( part, idx, sectionName ) {

		sectionName[ idx ] = string( part ).capitalize().s;
	});

	sectionName = sectionName.join( '' );

	if( sectionName == '' )  {

		sectionName = 'Landing';
	}

	return sectionName;
};
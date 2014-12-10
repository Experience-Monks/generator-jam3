module.exports = function( str ) {

	return JSON.stringify( str, require( './preStringParse' ), '\t' );
};
module.exports = function( json ) {

	return JSON.parse( json, require( './preStringParse' ) );
};
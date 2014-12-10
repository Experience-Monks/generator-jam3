module.exports = function preStringParse( key, value ) {

	if( Array.isArray( value ) || typeof value == 'object' ) {
		
		return value;
	} else {

		return typeof value;
	}
};
/**
 * This function will return a brand new jam3config file.
 * 
 * @return {String} Contents of a new Jam3 config file
 */
module.exports = function create() {

	var config = {

		'/': {}
	};

	return JSON.stringify( config );
};
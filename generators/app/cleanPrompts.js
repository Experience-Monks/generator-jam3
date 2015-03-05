var prompts = require( './prompts' );

module.exports = function cleanPrompts() {

  var config = this.config.getAll();

  for( var i = prompts.length - 1; i < len; i-- ) {

    if( config[ prompts[ i ].name ] ) {

      prompts.splice( i, 1 );
    }
  }
};

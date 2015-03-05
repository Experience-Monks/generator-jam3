var bigwheel = require( 'bigwheel' );

module.exports = bigwheel( function( done ) {

  done( {

    initSection: null,

    routes: require( './routes' )
  });
});

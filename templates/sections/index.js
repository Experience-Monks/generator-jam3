<%
	var useVue = _.contains( templateTypes, 'vue' );
%>var fs = require( 'fs' );
var promise = require( 'bluebird' );
<% if (useVue) { %>var vue = require( 'vue' );<% } %>
var model = require( '../../model' );

function <%= section %>() {}

<%= section %>.prototype = {

	init: function( req, done ) {

		promise.resolve()<% if (useVue) { %>		
		.then( function() {

			return new promise( function( resolve, reject ) {

				var containerVue = document.createElement( 'div' );
				containerVue.className = 'section';
				document.body.appendChild( containerVue );

				this.vue = new vue( {
					el: containerVue,
					data: model[ req.route ],
					template: fs.readFileSync( __dirname + '/<%= section %>.vue', 'utf8' ),
					ready: resolve
				});
			}.bind( this ));
		}.bind( this ))<% } %>		
		.then( done );
	},

	aniIn: function( req, done ) {

		done();
	},

	aniOut: function( req, done ) {

		done();
	},

	destroy: function( req, done ) {

		<% if (useVue) { %>this.vue.$destroy( true );<% } %>
	
		done();
	}
};

module.exports = <%= section %>;
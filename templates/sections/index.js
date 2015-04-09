'use strict';
<%
	var useVue = _.contains( templateTypes, 'vue' );
	var useHBS = _.contains( templateTypes, 'hbs' );
%>var fs = require( 'fs' );
<% if (useVue) { %>var vue = require( 'vue' );<% } %>
<% if (useHBS) { %>var hbs = require( 'handlebars' );<% } %>
var model = require( '../../model' );

function <%= section %>() {}

<%= section %>.prototype = {

	init: function( req, done ) {
		<% if (useVue) { %>
				var containerVue = document.createElement( 'div' );
				containerVue.className = 'section';
				document.body.appendChild( containerVue );

				this.vue = new vue( {
					el: containerVue,
					data: model[ req.route ],
					template: fs.readFileSync( __dirname + '/template.vue', 'utf8' ),
					ready: done
				});
		<% } %>
		<% if (useHBS) { %>
			this.dom = hbs.compile(fs.readFileSync( __dirname + '/template.hbs', 'utf8' ),model[req.route]);
			document.body.appendChild(this.dom);
			done();
		<% } %>
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

'use strict';
<%
	var useVue = _.contains( templateTypes, 'vue' );
	var useHBS = _.contains( templateTypes, 'hbs' );
%>var fs = require( 'fs' );
<% if (useVue) { %>var vue = require( 'vue' );<% } %>
<% if (useHBS) { %>var hbs = require( 'handlebars' );<% } %>
<% if (useHBS) { %>var domify = require( 'domify' );<% } %>
var model = require( '../../model' );

<% if (section=='Preloader') { %>
function <%= section %>(onComplete) {
  this.preloaded = onComplete;
}
<% } else { %>
function <%= section %>() {}
<% } %>

<%= section %>.prototype = {

	init: function( req, done ) {
		<% if (useVue) { %>
				var containerVue = document.createElement( 'div' );
				containerVue.className = 'section';
				document.body.appendChild( containerVue );

				this.vue = new vue( {
					data: <% if (section=='Preloader') { %>{}<% } else { %>model[ req.route ]<% } %>,
					template: fs.readFileSync( __dirname + '/template.vue', 'utf8' ),
					ready: done
				});
        this.vue.$mount(containerVue);
		<% } %>
		<% if (useHBS) { %>
			this.dom = domify(hbs.compile(fs.readFileSync( __dirname + '/template.hbs', 'utf8' ))(<% if (section!='Preloader') { %>model[ req.route ]<% } %>));
			document.body.appendChild(this.dom);
			done();
		<% } %>
	},

  resize: function(w,h) {

  },

	animateIn: function( req, done ) {

		done();
    <% if (section=='Preloader') { %>
    this.preloaded();
    <% } %>
	},

	animateOut: function( req, done ) {

		done();
	},

	destroy: function( req, done ) {

		<% if (useVue) { %>this.vue.$destroy( true );<% } %>
    <% if (useHBS) { %>this.dom.parentNode.removeChild(this.dom);<% } %>

		done();
	}
};

module.exports = <%= section %>;

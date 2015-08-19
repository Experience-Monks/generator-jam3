'use strict';
<%
	var useVue = _.contains( templateTypes, 'vue' );
	var useHBS = _.contains( templateTypes, 'hbs' );
%>var fs = require( 'fs' );
<% if (useVue) { %>var vue = require( 'vue' );<% } %>
<% if (useHBS) { %>var hbs = require( 'handlebars' );<% } %>
<% if (useHBS) { %>var domify = require( 'domify' );<% } %>
var model = require( '../../model' );

<% if (useES6) { %>
class <%= section %> {
<% if (section=='Preloader') { %>
  constructor(onComplete) {
    this.preloaded = onComplete;
  }
<% } else { %>
  constructor() {

  }
<% } %>
  init(req,done) {
<% } else { %>
<% if (section=='Preloader') { %>
function <%= section %>(onComplete) {
  this.preloaded = onComplete;
}
<% } else { %>
function <%= section %>() {}
<% } %>
<%= section %>.prototype = {
  init: function( req, done ) {
<% } %>
		<% if (useVue) { %>
				var containerVue = document.createElement( 'div' );
				containerVue.className = 'section';
				document.body.appendChild( containerVue );

				this.vue = new vue( {
					data: <% if (section=='Preloader') { %>{}<% } else { %>model[ req.route ]<% } %>,
					template: fs.readFileSync( __dirname + ((<%= changeFileNaming %>) ? '/' + __dirname + '.template.vue' : '/template.vue'), 'utf8' ),
					ready: done
				});
        this.vue.$mount(containerVue);
		<% } %>
		<% if (useHBS) { %>
			this.dom = domify(hbs.compile(fs.readFileSync( __dirname + ((<%= changeFileNaming %>) ? '/' + __dirname + '.template.hbs' : '/template.hbs'), 'utf8' ))(<% if (section!='Preloader') { %>model[ req.route ]<% } %>));
			document.body.appendChild(this.dom);
			<% if (!useVue) { %>
				done();
			<% } %>
		<% } %>
		<% if (!useHBS && !useVue) { %>
			done();
		<% } %>
<% if (useES6) { %>
  }
  resize(w,h) {
<% } else { %>
  },
  resize: function(w,h) {
<% } %>

<% if (useES6) { %>
  }
  animateIn(req,done) {
<% } else { %>
  },
  animateIn: function(req,done) {
<% } %>
		done();
    <% if (section=='Preloader') { %>
    this.preloaded();
    <% } %>
<% if (useES6) { %>
  }
  animateOut(req,done) {
<% } else { %>
  },
  animateOut: function(req,done) {
<% } %>
		done();
<% if (useES6) { %>
  }
  destroy(req,done) {
<% } else { %>
  },
  destroy: function(req,done) {
<% } %>
		<% if (useVue) { %>this.vue.$destroy( true );<% } %>
    <% if (useHBS) { %>this.dom.parentNode.removeChild(this.dom);<% } %>
		done();
	}
};
module.exports = <%= section %>;

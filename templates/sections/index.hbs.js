'use strict';
var fs = require( 'fs' );
var hbs = require( 'handlebars' );
var domify = require( 'domify' );
var model = require( '../../model' );
var Tween = require('gsap');

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
		this.dom = domify(hbs.compile(fs.readFileSync( __dirname + <% if (changeFileNaming) { %>'/<%= section %>.template.hbs'<% } else { %>'/template.hbs'<% } %>, 'utf8' ))(<% if (section!='Preloader') { %>model[ req.route ]<% } %>));
		document.body.appendChild(this.dom);
    Tween.set(this.dom, { opacity: 0 });
    done();
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
    Tween.to(this.dom, 1, {
      opacity: 1,
      onComplete: done
    });
    <% if (section==='Preloader') { %>this.preloaded();<% } %>
<% if (useES6) { %>
  }
  animateOut(req,done) {
<% } else { %>
  },
  animateOut: function(req,done) {
<% } %>
		Tween.to(this.dom, 1, {
      opacity: 0,
      onComplete: done
    });
<% if (useES6) { %>
  }
  destroy(req,done) {
<% } else { %>
  },
  destroy: function(req,done) {
<% } %>
    this.dom.parentNode.removeChild(this.dom);
		done();
	}
};
module.exports = <%= section %>;

'use strict';
var fs = require( 'fs' );
var Vue = require( 'vue' );
var model = require( '../../model' );
var <%= section %> = Vue.extend({
  replace: true,
  data: function() {
    return this.model;
  },
  template: fs.readFileSync( __dirname + <% if (changeFileNaming) { %>'/<%= section %>.template.vue'<% } else { %>'/template.vue'<% } %>, 'utf8' ),
  created: function () {
  },
  ready: function () {
  },
  computed: {

  },
  methods: {
    init: function(req, done){
      this.model = <% if (section==='Preloader') { %>{}<% } else { %>model[req.route]<% } %>;
      var containerVue = document.createElement( 'div' );
      document.body.appendChild( containerVue );
      this.$mount(containerVue);
      done();
    },
    animateIn: function(req, done){
      done();
      <% if (section==='Preloader') { %>this.preloaded();<% } %>
    },
    animateOut: function(req, done){
      done();
    },
    resize: function(w,h){

    },
    destroy: function(req, done){
      this.$destroy(true);
      done();
    }
  },
  components: {

  }
});
<% if (section==='Preloader') { %>module.exports = function(onComplete) {
  var vue = new Preloader();
  vue.preloaded = onComplete;
  return vue;
};<% } else { %>module.exports = <%= section %>;
<% } %>

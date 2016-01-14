'use strict';
var fs = require('fs');
var hbs = require('handlebars');
var domify = require('domify');
var model = require('../../model');
var Tween = require('gsap');
{{if useES6}}
class {{section}} {
  constructor() {
    
  }{{else}}
function {{section}}() {}
{{section}}.prototype = {{{/if}}
  {{if useES6}}init{{else}}init: function{{/if}}(req, done) {
    this.dom = domify(hbs.compile(fs.readFileSync(__dirname + '/template.hbs', 'utf8'))(model[req.route]));
    document.body.appendChild(this.dom);
    Tween.set(this.dom, {
      opacity: 0
    });
    done();
  }{{if useES6|falsy}},{{/if}}
  {{if useES6}}resize{{else}}resize: function{{/if}}(w, h) {}{{if useES6|falsy}},{{/if}}
  {{if useES6}}animateIn{{else}}animateIn: function{{/if}}(req, done) {
    Tween.to(this.dom, 1, {
      opacity: 1,
      onComplete: done
    });
  }{{if useES6|falsy}},{{/if}}
  {{if useES6}}animateOut{{else}}animateOut: function{{/if}}(req, done) {
    Tween.to(this.dom, 1, {
      opacity: 0,
      onComplete: done
    });
  }{{if useES6|falsy}},{{/if}}
  {{if useES6}}destroy{{else}}destroy: function{{/if}}(req, done) {
    this.dom.parentNode.removeChild(this.dom);
    done();
  }
};
module.exports = {{section}};
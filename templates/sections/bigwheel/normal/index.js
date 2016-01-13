'use strict';
var fs = require('fs');
var hbs = require('handlebars');
var domify = require('domify');
var model = require('../../model');
var Tween = require('gsap');
function {{section}}() {}
{{section}}.prototype = {
  init: function (req, done) {
    this.dom = domify(hbs.compile(fs.readFileSync(__dirname + '/template.hbs', 'utf8'))(model[req.route]));
    document.body.appendChild(this.dom);
    Tween.set(this.dom, {
      opacity: 0
    });
    done();
  },
  resize: function (w, h) {},
  animateIn: function (req, done) {
    Tween.to(this.dom, 1, {
      opacity: 1,
      onComplete: done
    });
  },
  animateOut: function (req, done) {
    Tween.to(this.dom, 1, {
      opacity: 0,
      onComplete: done
    });
  },
  destroy: function (req, done) {
    this.dom.parentNode.removeChild(this.dom);
    done();
  }
};
module.exports = {{section}};
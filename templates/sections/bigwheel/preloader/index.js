'use strict';
var fs = require('fs');
var hbs = require('handlebars');
var domify = require('domify');
var model = require('../../model');
var Tween = require('gsap');

class Preloader {
  constructor(onComplete) {
    this.preloaded = onComplete;
  }

  init(req, done) {
    this.dom = domify(hbs.compile(fs.readFileSync(__dirname + '/template.hbs', 'utf8'))());
    document.body.appendChild(this.dom);
    Tween.set(this.dom, {
      opacity: 0
    });
    done();
  }

  resize(w, h) {}

  animateIn(req, done) {
    Tween.to(this.dom, 1, {
      opacity: 1,
      onComplete: done
    });
    this.preloaded();
  }

  animateOut(req, done) {
    Tween.to(this.dom, 1, {
      opacity: 0,
      onComplete: done
    });
  }

  destroy(req, done) {
    this.dom.parentNode.removeChild(this.dom);
    done();
  }
};
module.exports = Preloader;

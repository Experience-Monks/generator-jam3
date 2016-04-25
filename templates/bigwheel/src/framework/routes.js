'use strict';
module.exports = {
  'pushState': {{pushState}},
  '/': require('../sections/Landing/{{#if sectionNames}}Landing{{else}}index{{/if}}.js'),
  '404': '/'
};

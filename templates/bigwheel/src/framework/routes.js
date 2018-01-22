'use strict';
module.exports = {
  'pushState': true,
  '/': require('../sections/Landing/{{#if sectionNames}}Landing{{else}}index{{/if}}.js'),
  '404': '/'
};

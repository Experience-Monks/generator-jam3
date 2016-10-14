'use strict';
import 'babel-polyfill';
import framework from './framework';
import domready from 'domready';
import './globals';

if (CONFIG.NODE_ENV === 'development') {
  require('./util/stats');
}

domready(framework);
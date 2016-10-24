'use strict';
import 'babel-polyfill';
import framework from './framework';
import domready from 'domready';
if (process.env.NODE_ENV === 'development') import './util/stats';

domready(framework);
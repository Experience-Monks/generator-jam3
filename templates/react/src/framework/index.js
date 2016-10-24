'use strict';
import React from 'react';
import Perf from 'react-addons-perf';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect, {{#if pushState}}browserHistory{{else}}hashHistory{{/if}}, Redirect} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {Provider} from 'react-redux';
import detect from '../util/detect';

import store from '../store';
import App from '../sections/App{{#if sectionNames}}/App{{/if}}';
import Landing from '../sections/Landing{{#if sectionNames}}/Landing{{/if}}';

{{#if pushState}}const history = syncHistoryWithStore(browserHistory, store);{{else}}const history = syncHistoryWithStore(hashHistory, store);{{/if}}

export default function() {
  var container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);
  if (process.env.NODE_ENV === 'development') window.Perf = Perf;
  document.body.className = merge(document.body.className.split(' '),detect.classes).join(' ');

  render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Landing} />
        </Route>
      </Router>
    </Provider>
  ),container);
};


function merge() {
  var arr = [];
  for (var i=0; i<arguments.length; i++) {
    if (Array.isArray(arguments[i])) {
      arguments[i].forEach(function(cur) {
        if (cur && arr.indexOf(cur)<0) arr.push(cur);
      });
    }
  }
  return arr;
}
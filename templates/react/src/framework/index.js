'use strict';
import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect, useRouterHistory, Redirect} from 'react-router';
import {{#if pushState}}createBrowserHistory{{else}}createHashHistory{{/if}} from 'history/lib/{{#if pushState}}createBrowserHistory{{else}}createHashHistory{{/if}}'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { Provider } from 'react-redux';
import detect from '../util/detect';{{#if unsupported}}
import warning from '../util/warning';
{{/if}}

import store from '../store';

import routeKeys from './route-keys';
import App from '../sections/App';
import Landing from '../sections/Landing';

const history = syncHistoryWithStore(useRouterHistory({{#if pushState}}createBrowserHistory{{else}}createHashHistory{{/if}})({ basename: process.env.BASENAME }), store);

let Test;
let TestRoutes;

export default function() {
  {{#if unsupported}}warning();
  {{/if}}const container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);
  document.body.className = [...document.body.className.split(' '), ...detect.classes].join(' ');

  (process.env.NODE_ENV === 'development') && setDevTools();

  render((
    <Provider store={store}>
      <Router
          history={history}
          onUpdate={handleRouteChange}
        >
          <Route component={App}>
            <Route path={routeKeys.Landing} component={Landing}/>
            {TestRoutes && <Route path={routeKeys.Test} component={Test}>{TestRoutes}</Route>}
            <Redirect path="*" to={routeKeys.Landing}/>
          </Route>
        </Router>
      </Provider>
    ), container);
  }

function setDevTools() {
  Test = require('../test/index').default;
  TestRoutes = require('../test/routes').default;
  window.Perf = require('react-addons-perf');
}

function handleRouteChange() {}

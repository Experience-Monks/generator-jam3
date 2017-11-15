'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { Provider } from 'react-redux';
import detect from '../util/detect';{{#if unsupported}}
import warning from '../util/warning';
{{/if}}

import store, { history } from '../store';
import App from '../sections/App';
import routes from '../routes';

let appRoutes = routes;

export default function() {
  warning();
  const container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);
  document.body.className = [
    ...document.body.className.split(' '),
    ...detect.classes
  ].join(' ');

  if (process.env.NODE_ENV === 'development') {
    appRoutes = routes.concat(require('../test').default);
  }

  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route render={props => <App {...props} routes={appRoutes} />} />
      </ConnectedRouter>
    </Provider>,
    container
  );
}

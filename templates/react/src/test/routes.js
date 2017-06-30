import React from 'react';
import { Route } from 'react-router';
import componentsManifest from './manifest';

const route = (
  <Route>
    {
      Object.keys(componentsManifest).map((componentName) => {
        const componentData = componentsManifest[componentName];
        const Component = componentData.component.default || componentData.default;
        const props = componentData.props;

        return (
          <Route
            key={componentName}
            path={componentName}
            component={(routeProps) =>
              <Component {...props} {...routeProps} />
            }
          />
        );
      })
    }
  </Route>
);

export default route;

import React, { Component } from 'react';
import invariant from 'invariant';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

export default function ConnectTransitionWrapper() {
  return function wrapConnectedComponent(ConnectedComponent) {
    invariant(
      ConnectedComponent.WrappedComponent,
      'You are trying to wrap a component that is not wrapped in react-redux Connect'
    );
    class ConnectTransitionWrapper extends Component {
      static displayName = `ConnectTransitionWrapper(${getDisplayName(
        ConnectedComponent.WrappedComponent
      )})`;
      static WrappedComponent = ConnectedComponent.WrappedComponent;

      componentWillAppear(callback) {
        const { connectInstance = {} } = this.refs;
        const { wrappedInstance = {} } = connectInstance;

        if (wrappedInstance.componentWillAppear) {
          wrappedInstance.componentWillAppear(callback);
        } else {
          callback();
        }
      }

      componentDidAppear() {
        const { connectInstance = {} } = this.refs;
        const { wrappedInstance = {} } = connectInstance;

        if (wrappedInstance.componentDidAppear) {
          wrappedInstance.componentDidAppear();
        }
      }

      componentWillEnter(callback) {
        const { connectInstance = {} } = this.refs;
        const { wrappedInstance = {} } = connectInstance;

        if (wrappedInstance.componentWillEnter) {
          wrappedInstance.componentWillEnter(callback);
        } else {
          callback();
        }
      }

      componentDidEnter() {
        const { connectInstance = {} } = this.refs;
        const { wrappedInstance = {} } = connectInstance;

        if (wrappedInstance.componentDidEnter) {
          wrappedInstance.componentDidEnter();
        }
      }

      componentWillLeave(callback) {
        const { connectInstance = {} } = this.refs;
        const { wrappedInstance = {} } = connectInstance;

        if (wrappedInstance.componentWillLeave) {
          wrappedInstance.componentWillLeave(callback);
        } else {
          callback();
        }
      }

      componentDidLeave() {
        const { connectInstance } = this.refs;
        const { wrappedInstance = {} } = connectInstance;
        this.isLeaving = false;
        if (wrappedInstance.componentDidLeave) {
          wrappedInstance.componentDidLeave();
        }
      }

      render() {
        return <ConnectedComponent {...this.props} ref="connectInstance" />;
      }
    }

    return ConnectTransitionWrapper;
  };
}

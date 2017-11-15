'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import TransitionGroup from 'react-transition-group-plus';

import Preloader from '../../components/Preloader';
import RotateScreen from '../../components/Rotate{{#if sectionNames}}/Rotate{{/if}}';

import detect from '../../util/detect';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 960,
      height: 570
    };
  }

  onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  componentWillMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  matchPath = path => matchPath({{#if pushState}}location.pathname{{else}}location.hash.replace('#', ''){{/if}}, path);

  renderPreloader = () => {
    return (
      <Preloader
        key="preloader"
        assetsList={this.props.assets}
        setProgress={this.props.onProgress}
        setReady={this.props.onReady}
        windowWidth={this.state.width}
        windowHeight={this.state.height}
      />
    );
  };

  renderRoute = () => {
    return this.props.routes
      .filter(({ path }) => this.matchPath(path))
      .map(({ Component, key, props }) => <Component key={key} {...props} />);
  };

  render() {
    const isTestRoute = location.pathname.split('/')[1] === 'test';
    const renderContent = this.props.ready || isTestRoute
      ? this.renderRoute
      : this.renderPreloader;

    return (
      <div id="app">
        <TransitionGroup id="content" component="div" transitionMode="out-in">
          {renderContent()}
        </TransitionGroup>
        {detect.isPhone && <RotateScreen />}
      </div>
    );
  }
}

App.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  ready: PropTypes.bool,
  section: PropTypes.string,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  setWindowSize: PropTypes.func
};

App.defaultProps = {
  ready: false
};

export default App;

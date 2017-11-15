'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group-plus';

import Preloader from '../../components/Preloader';
import RotateScreen from '../../components/Rotate{{#if sectionNames}}/Rotate{{/if}}';

import detect from '../../util/detect';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.props.setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  getContent = () => {
    const isTestRoute = (location.pathname.split('/')[1] === 'test');

    if (this.props.ready || isTestRoute) {
      return React.cloneElement(this.props.children, {
        key: this.props.section,
        section: this.props.section,
        windowWidth: this.props.windowWidth,
        windowHeight: this.props.windowHeight,
      });
    } else {
      return (
        <Preloader/>
      );
    }
  };

  render() {
    return (
      <div id="App">
        <TransitionGroup id="content" component="div" transitionMode="out-in">
          { this.getContent() }
        </TransitionGroup>
        { detect.isPhone && <RotateScreen/> }
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
  setWindowSize: PropTypes.func,
};

App.defaultProps = {
  ready: false,
};

export default App;

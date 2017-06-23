'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Preloader from '../../components/Preloader{{#if sectionNames}}/Preloader{{/if}}';
import RotateScreen from '../../components/Rotate{{#if sectionNames}}/Rotate{{/if}}';
import { setReady, setProgress, setAssets } from './actions';
import TransitionGroup from 'react-transition-group-plus';
import detect from '../../util/detect';

class App extends React.Component {
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

  getContent(isTestRoute) {
    if (this.props.ready || isTestRoute) {
      return React.cloneElement(this.props.children, {
        key: this.props.section,
        windowWidth: this.state.width,
        windowHeight: this.state.height
      });
    } else {
      return <Preloader
        assetsList={this.props.assets}
        setProgress={this.props.onProgress}
        setReady={this.props.onReady}
        windowWidth={this.state.width}
        windowHeight={this.state.height}
      />
    }
  }

  render() {
    const isTestRoute = (location.pathname.split('/')[1] === 'test');

    return (
      <div id="app">
        <TransitionGroup id="content" component="div" transitionMode="out-in">
          {this.getContent(isTestRoute)}
        </TransitionGroup>
        { detect.isPhone && <RotateScreen/> }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let section = ownProps.location.pathname.split('/').filter(Boolean)[0] || 'landing';
  return {
    progress: state.progress,
    ready: state.ready,
    assets: state.assets,
    section: section
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onProgress: val => dispatch(setProgress(val)),
    onReady: val => dispatch(setReady(val)),
    onSetAssets: val => dispatch(setAssets(val))
  }
};

App.defaultProps = {
  assets: [],
  progress: 0,
  ready: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

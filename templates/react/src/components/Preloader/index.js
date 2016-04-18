'use strict';
import React from 'react';
import ReactF1 from 'react-f1';
import states from './states';
import transitions from './transitions';

class Preloader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'out'
    };
  }
  componentWillAppear(done) {
    this.setState({
      state: 'idle',
      onComplete: () => {
        this.props.onProgress(1);
        this.props.onReady(true);
        done();
      }
    });
  }
  componentWillEnter(done) {
    this.setState({
      state: 'idle',
      onComplete: () => {
        this.props.onProgress(1);
        this.props.onReady(true);
        done();
      }
    });
  }
  componentWillLeave(done) {
    this.setState({
      state: 'out',
      onComplete: done
    });
  }
  render() {
    var style = {width: this.props.width, height: this.props.height};
    return <ReactF1
      id="preloader"
      data-f1="container"
      style={style}
      go={this.state.state}
      onComplete={this.state.onComplete}
      states={states(this.props)}
      transitions={transitions(this.props)}
    />;
  }
};

Preloader.defaultProps = {
  onProgress: function() {},
  onReady: function() {},
  assets: [],
  width: 960,
  height: 570
};


export default Preloader;
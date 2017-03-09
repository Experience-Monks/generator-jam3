'use strict';
import React from 'react';
import ReactF1 from 'react-f1';
import states from './states';
import transitions from './transitions';

class {{section}} extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'out'
    };
  }
  componentWillEnter(done) {
    this.setState({
      state: 'idle',
      onComplete: done
    });
  }
  componentWillLeave(done) {
    this.setState({
      state: 'out',
      onComplete: done
    });
  }
  render() {
    const style = {width: this.props.windowWidth, height: this.props.windowHeight};
    return <ReactF1
      go={this.state.state}
      onComplete={this.state.onComplete}
      states={states(this.props)}
      transitions={transitions(this.props)}
      style={style}
      id="{{section}}"
      data-f1="container"
    />;
  }
};

{{section}}.defaultProps = {
  windowWidth: 960,
  windowHeight: 570
};

export default {{section}};
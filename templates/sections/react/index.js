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
    var style = {width: this.props.width, height: this.props.height};
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
  width: 960,
  height: 570
};

export default {{section}};
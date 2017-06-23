'use strict';
import React from 'react';
import PropTypes from 'prop-types';

export default class VideoTimeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: props.currentTime,
    };
    this.isMouseDown = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTime !== this.props.currentTime) {
      if (!this.isMouseDown) {
        this.setState({currentTime: nextProps.currentTime});
      }
    }
  }

  handleChange = () => {
    this.props.onTimeChange(this.input.value);
    this.setState({currentTime: this.input.value});
  };

  handleMouseDown = () => {
    this.isMouseDown = true;
  };

  handleMouseUp = () => {
    this.isMouseDown = false;
  };

  render() {
    const props = this.props;

    return (
      <div
        className={`VideoTimeline ${props.className}`}
        style={props.style}
        ref={r => this.container = r}
      >
        <div
          className="progress"
          style=\{{width: this.state.currentTime / this.props.duration * 100 + '%'}}
        />
        <input
          type="range"
          ref={r => this.input = r}
          min="0"
          max={this.props.duration}
          step="0.001"
          onChange={this.handleChange}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          value={this.state.currentTime}
        />
      </div>
    );
  }
}

VideoTimeline.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  duration: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

VideoTimeline.defaultProps = {
  className: '',
  style: {},
};

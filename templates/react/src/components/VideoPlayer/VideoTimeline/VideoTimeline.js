import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class VideoTimeline extends PureComponent {
  constructor(props) {
    super(props);
    this.isMouseDown = false;
    this.state = {
      currentTime: props.currentTime,
    };
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
    return (
      <div className="VideoTimeline">
        <div
          className="progress"
          style={{width: this.state.currentTime / this.props.duration * 100 + '%'}}
        />
        <input
          type="range"
          ref={ input => this.input = input }
          min="0"
          max={ this.props.duration }
          step="0.00001"
          onChange={ this.handleChange }
          onMouseDown={ this.handleMouseDown }
          onMouseUp={ this.handleMouseUp }
          value={ this.state.currentTime }
        />
      </div>
    );
  }
}

VideoTimeline.propTypes = {
  duration: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

VideoTimeline.defaultProps = {};

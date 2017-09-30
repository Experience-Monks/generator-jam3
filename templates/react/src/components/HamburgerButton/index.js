import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const states = {
  idle: 'idle',
  close: 'close',
  back: 'back',
};

export default class HamburgerButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buttonState: props.state,
      isMouseOver: props.isMouseOver,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.buttonState !== this.props.buttonState) {
      this.setState({buttonState: nextProps.buttonState});
    }
    if (nextProps.isMouseOver !== this.props.isMouseOver) {
      this.setState({isMouseOver: nextProps.isMouseOver});
    }
  }

  handleClick = (e) => {
    const buttonState = this.state.buttonState === states.idle ? this.props.activeState : states.idle;
    this.setState({buttonState});
    this.props.onClick(buttonState);
  };

  handleMouseEnter = (e) => {
    this.setState({isMouseOver: true});
    this.props.onMouseEnter();
  };

  handleMouseLeave = (e) => {
    this.setState({isMouseOver: false});
    this.props.onMouseLeave();
  };

  render() {
    const props = this.props;
    const state = this.state;

    const style = Object.assign({}, this.props.style);
    const buttonClass = `HamburgerButton ${state.buttonState} ${state.isMouseOver ? 'hover' : ''} ${props.className} `;

    return (
      <button
        className={buttonClass}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        ref={r => this.container = r}
        tabIndex={props.tabIndex}
      >
        <div className="bars-container">
          {
            [0, 1, 2].map(item => <span key={item} className={`bar ${item}`}/>)
          }
        </div>
      </button>
    );
  }
}

HamburgerButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  state: PropTypes.string,
  activeState: PropTypes.string,
  isMouseOver: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

HamburgerButton.defaultProps = {
  className: '',
  style: {},
  tabIndex: 0,
  state: states.idle,
  activeState: states.close,
  isMouseOver: false,
  onClick: () => f => f,
  onMouseEnter: f => f,
  onMouseLeave: f => f,
};

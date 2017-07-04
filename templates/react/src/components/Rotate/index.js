import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import detect from '../../util/detect';
import RotateIcon from '../../../raw-assets/svg/rotate.svg';

export default class RotateScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orientation: detect.orientation
    };
  }

  componentDidMount() {
    if (detect.isAndroid) {
      window.addEventListener('orientationchange', this.handleOrientationChange);
    } else {
      window.addEventListener('resize', this.handleOrientationChange);
    }
  }

  componentWillUnmount() {
    if (detect.isAndroid) {
      window.removeEventListener('orientationchange', this.handleOrientationChange);
    } else {
      window.removeEventListener('resize', this.handleOrientationChange);
    }
  }

  handleOrientationChange = () => {
    if (detect.orientation !== this.state.orientation) {
      this.setState({orientation: detect.orientation});
    }
  };

  render() {
    const isPortrait = this.state.orientation === 'portrait';
    const visible = this.props.portrait && !isPortrait || !this.props.portrait && isPortrait;
    const style = {
      visibility: visible ? 'visible' : 'hidden'
    };

    return (
      <div id="Rotate" style={style}>
        <div className="container">
          <SVGInline
            component="div"
            className="rotate-icon"
            svg={RotateIcon}
          />
          <p>Please rotate your device<br/>into portrait mode.</p>
        </div>
      </div>
    );
  }
}

RotateScreen.propTypes = {
  portrait: PropTypes.bool
};

RotateScreen.defaultProps = {
  portrait: true
};

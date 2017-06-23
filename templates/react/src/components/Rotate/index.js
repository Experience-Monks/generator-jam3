import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import detect from '../../util/detect';
import RotateIcon from '../../../raw-assets/svg/rotate.svg';

export default class RotateScreen extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.orientation !== detect.orientation;
  }

  render() {
    this.orientation = detect.orientation;
    const visible = (this.props.portrait && this.orientation === 'landscape') || (!this.props.portrait && this.orientation === 'portrait');
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
    )
  }
}

RotateScreen.propTypes = {
  portrait: PropTypes.bool
};

RotateScreen.defaultProps = {
  portrait: true
};

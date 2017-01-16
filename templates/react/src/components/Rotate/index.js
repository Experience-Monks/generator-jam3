import React from 'react';
import SVGInline from 'react-svg-inline';
import detect from '../../util/detect';
import RotateIcon from '../../../raw-assets/svg/rotate.svg';

export default class RotateScreen extends React.Component {

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
      <div id="rotate" style={style}>
        <div className="container">
          <div className="rotate-icon">
            <SVGInline svg={RotateIcon}/>
          </div>
          <p>Please rotate your device<br/>into portrait mode.</p>
        </div>
      </div>
    )
  }
}

RotateScreen.propTypes = {
  portrait: React.PropTypes.bool
};

RotateScreen.defaultProps = {
  portrait: true
};
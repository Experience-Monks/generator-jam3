import React from 'react';
import SVGInline from 'react-svg-inline';
import RotateIcon from '../../../raw-assets/svg/rotate-screen.svg';

export default class RotateScreen extends React.Component {

  static propTypes = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.width !== this.props.width;
  }

  render() {
    const isLandscape = this.props.width > this.props.height;

    const style = {
      visibility: isLandscape ? 'visible' : 'hidden'
    };

    return (
      <div id="RotateScreen" style={style}>
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
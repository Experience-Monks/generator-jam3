'use strict';
import React from 'react';
import Tween from 'gsap';

class {{section}} extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillEnter(done) {
    Tween.fromTo(this.container,0.5,{autoAlpha: 0},{autoAlpha: 1, onComplete: done});
  }
  componentWillLeave(done) {
    Tween.to(this.container,0.5,{autoAlpha: 0, onComplete: done});
  }
  render() {
    const style = {width: this.props.windowWidth, height: this.props.windowHeight};
    return <div
      style={style}
      id="{{section}}"
      ref={(e)=>this.container=e}
    >
    </div>;
  }
};

{{section}}.defaultProps = {
  windowWidth: 960,
  windowHeight: 570
};

export default {{section}};
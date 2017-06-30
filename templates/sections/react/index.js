'use strict';
import React from 'react';
import Tween from 'gsap';

class {{section}} extends React.Component {
  constructor(props) {
    super(props);
    this.setContainer = this.setContainer.bind(this);
  }
  componentWillEnter(done) {
    Tween.to(this.container, 0.5, {autoAlpha: 1, onComplete: done});
  }
  componentWillLeave(done) {
    Tween.to(this.container, 0.5, {autoAlpha: 0, onComplete: done});
  }
  setContainer(e) {
    this.container = e;
    Tween.set(this.container, {autoAlpha: 0});
  }
  render() {
    const style = {width: this.props.windowWidth, height: this.props.windowHeight};
    return <div
      style={style}
      id="{{section}}"
      ref={this.setContainer}
    >
    </div>;
  }
};

{{section}}.defaultProps = {
  windowWidth: 960,
  windowHeight: 570
};

export default {{section}};

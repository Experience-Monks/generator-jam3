'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import animate from 'gsap';

class {{section}} extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    animate.set(this.container, {autoAlpha: 0});
  }

  componentWillAppear(done) {
    this.animateIn(done);
  }

  componentWillEnter(done) {
    this.animateIn(done);
  }

  componentWillLeave(done) {
    this.animateOut(done);
  }

  animateIn = (onComplete) => {
    animate.to(this.container, 0.5, {autoAlpha: 1, onComplete});
  };

  animateOut = (onComplete) => {
    animate.to(this.container, 0.5, {autoAlpha: 0, onComplete});
  };

  render() {
    const props = this.props;
    const style = Object.assign({}, props.style);

    return (
      <main
        id="{{section}}"
        style={style}
        ref={r => this.container = r}
      >
        <h1>Landing</h1>
      </main>
    );
  }
};

{{section}}.propTypes = {
  style: PropTypes.object,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
};

{{section}}.defaultProps = {
  style: {},
};

export default {{section}};

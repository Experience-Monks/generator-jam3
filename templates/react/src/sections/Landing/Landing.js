import React from 'react';
import animate from 'gsap';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class Landing extends React.PureComponent {
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
        id="Landing"
        style={style}
        ref={r => this.container = r}
      >
        <h1>Landing</h1>
      </main>
    );
  }
}

Landing.propTypes = {
  style: PropTypes.object,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
};

Landing.defaultProps = {
  style: {},
};

export default Landing;

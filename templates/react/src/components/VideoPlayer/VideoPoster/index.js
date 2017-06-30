'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import animate from 'gsap';

import SVGInline from 'react-svg-inline';
import playIcon from '../../../../raw-assets/svg/play.svg';

export default class VideoPoster extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillAppear(done) {
    this.animateIn(done);
  }

  componentWillEnter(done) {
    this.animateIn(done);
  }

  componentWillLeave(done) {
    this.animateOut();
    done();
  }

  animateIn = (onComplete) => {
    animate.fromTo(this.container, (this.props.fadeDuration / 1000), {autoAlpha: 0}, {
      autoAlpha: 1,
      onComplete
    });
  };

  animateOut = (onComplete) => {
    animate.to(this.container, (this.props.fadeDuration / 1000), {autoAlpha: 0, onComplete});
  };

  render() {
    const props = this.props;
    const style = Object.assign({backgroundImage: `url(${props.poster})`}, props.style);

    return (
      <div
        className={`VideoPoster ${props.className}`}
        style={style}
        ref={r => this.container = r}
        onClick={props.onClick}
      >
        {
          props.hasPlayButton &&
          <button aria-label="Play Video">
            <SVGInline svg={playIcon}/>
          </button>
        }
      </div>
    );
  }
}

VideoPoster.propTypes = {
  hasPlayButton: PropTypes.bool,
  poster: PropTypes.string.isRequired,
  fadeDuration: PropTypes.number, // in milliseconds
  onClick: PropTypes.func,
};

VideoPoster.defaultProps = {
  className: '',
  style: {},
  hasPlayButton: false,
  fadeDuration: 0,
};

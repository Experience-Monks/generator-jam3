import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import animate from '@jam3/gsap-promise';
import { findDOMNode } from 'react-dom';
import { BackgroundCover } from 'background-cover';

import settings from '../../../util/settings';

import SquareButton from '../../SquareButton/SquareButton';

export default class VideoPoster extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillAppear(done) {
    this.animateIn();
    done();
  }

  componentWillEnter(done) {
    this.animateIn();
    done();
  }

  async componentWillLeave(done) {
    await this.animateOut();
    done();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.containerWidth !== this.props.containerWidth || nextProps.containerHeight !== this.props.containerHeight) {
      this.handleResize(nextProps.windowWidth, nextProps.windowHeight);
    }
  }

  handleResize = () => {
    this.props.shouldPosterCover && BackgroundCover(this.image, this.container);
  };

  animateIn = () => {
    const ease = settings.FloresOut;
    return Promise.all([
      animate.fromTo(this.container, this.props.fadeDuration, {autoAlpha: 0}, {autoAlpha: 1}),
      this.button ? animate.fromTo(findDOMNode(this.button), this.props.fadeDuration, {y: 30}, {
        y: 0,
        ease
      }) : Promise.resolve(),
    ]);
  };

  animateOut = () => {
    return Promise.all([
      animate.to(this.container, this.props.fadeDuration, {autoAlpha: 0}),
      this.button ? animate.to(findDOMNode(this.button), this.props.fadeDuration, {
        y: 30,
        ease: settings.FloresOut
      }) : Promise.resolve(),
    ]);
  };

  render() {
    const props = this.props;
    return (
      <div
        className="VideoPoster"
        onClick={props.onClick}
        ref={r => this.container = r}
      >
        <img
          src={props.poster}
          ref={r => this.image = r}
          onLoad={this.handleResize}
        />
        {
          props.hasPlayButton &&
          <SquareButton
            idleColor={'#fff'}
            idleBorderColor={'#686868'}
            hoverContentColor={'#fff'}
            icon={`play`}
            hasLine={true}
            onClick={props.onClick}
            mouseLeaveTimeScale={0.7}
            className="play-button"
            ref={r => this.button = r}
          >
            {props.playButtonText}
          </SquareButton>
        }
      </div>
    );
  }
}

VideoPoster.propTypes = {
  hasPlayButton: PropTypes.bool,
  playButtonText: PropTypes.string,
  poster: PropTypes.string,
  onClick: PropTypes.func,
  fadeDuration: PropTypes.number,
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
  shouldPosterCover: PropTypes.bool,
};

VideoPoster.defaultProps = {
  hasPlayButton: false,
  playButtonText: 'Play Video',
  fadeDuration: 0,
  shouldPosterCover: false,
};

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BackgroundVideo from 'react-background-video-player';
import TransitionGroup from 'react-transition-group-plus';
import animate from 'gsap';

import secondsToTime from '../../util/seconds-to-minutes';
import fullScreen from '../../util/handle-fullscreen';

import VideoTimeline from './VideoTimeline/VideoTimeline';
import VideoPoster from './VideoPoster/VideoPoster';
import SlotMachineButton from '../SlotMachineButton/SlotMachineButton';
import CloseButton from '../CloseButton/CloseButton';
import SvgContainer from '../SVGContainer/SVGContainer';

export default class VideoPlayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: props.windowWidth || 0,
      containerHeight: props.windowHeight || 0,
      isPlaying: false,
      isMuted: props.muted,
      isFullScreen: false,
      currentTime: 0,
      progress: 0,
      duration: 0,
      showPoster: undefined,
      startTime: props.startTime,
    };
  }

  componentDidMount() {
    this.fullScreen = fullScreen(this.container, this._handleEnterFullScreen, this._handleExitFullScreen);
    if (this.props.isControlsVisibleOnLoad) {
      this._setHideControlsTimeout();
    } else {
      this.hideControls(0);
    }
    if (this.props.autoPlay) {
      this.autoPlayTimeout = setTimeout(() => {
        this.play();
        this._clearAutoPlayTimeout();
      }, this.props.autoPlayDelay * 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.windowWidth !== this.props.windowWidth || nextProps.windowHeight !== this.props.windowHeight) {
      this._handleResize({
        containerWidth: nextProps.windowWidth,
        containerHeight: nextProps.windowHeight
      });
    }
    if (nextProps.startTime !== this.props.startTime) {
      this.setState({startTime: nextProps.startTime});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPlaying !== this.state.isPlaying) {
      if (this.state.isPlaying) {
        this.props.onPlay(this.props.id);
        this._setHideControlsTimeout();
        this.state.showPoster && this.hidePoster();
      } else {
        this.props.onPause(this.props.id);
        this._clearHideControlsTimeout();
        this.showControls();
      }
    }
  }

  componentWillUnmount() {
    this.fullScreen.destroy();
    this.pause();
    this._clearHideControlsTimeout();
    this._clearAutoPlayTimeout();
  }

  showControls = (dur = 0.5, ease = Expo.easeOut) => {
    this.topNav && animate(this.topNav, dur, {y: '0%', autoAlpha: 1, ease});
    animate(this.controls, dur, {y: '0%', autoAlpha: 1, ease})
  };

  hideControls = (dur = 0.5, ease = Expo.easeOut) => {
    this.topNav && animate(this.topNav, dur, {y: '-100%', autoAlpha: 0, ease});
    animate(this.controls, dur, {y: '100%', autoAlpha: 0, ease});
  };

  setStartTime = (startTime) => {
    this.setState({startTime});
  };

  showPoster = () => {
    this.setState({showPoster: true});
    this.hideControls();
  };

  hidePoster = () => {
    this.setState({showPoster: false});
  };

  getVideoElement = () => {
    return this.video.video;
  };

  play = () => {
    !this.state.isPlaying && this.video.play();
  };

  pause = () => {
    this.state.isPlaying && this.video.pause();
  };

  mute = () => {
    !this.state.isMuted && this.video.mute();
  };

  unmute = () => {
    this.state.isMuted && this.video.unmute();
  };

  togglePlay = () => {
    this.video.togglePlay();
  };

  toggleMute = () => {
    this.video.toggleMute();
  };

  toggleFullScreen = () => {
    this.state.isFullScreen ? this.fullScreen.exit() : this.fullScreen.enter();
  };

  _clearHideControlsTimeout = () => {
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
      this.hideControlsTimeout = undefined;
    }
  };

  _clearAutoPlayTimeout = () => {
    this.autoPlayTimeout && clearTimeout(this.autoPlayTimeout);
  };

  _setHideControlsTimeout = () => {
    this._clearHideControlsTimeout();
    this.hideControlsTimeout = setTimeout(() => {
      this.state.isPlaying && this.hideControls();
    }, this.props.controlsTimeout);
  };

  _handleResize = (newSize) => {
    this.setState(newSize);
  };

  _handleEnterFullScreen = () => {
    this.setState({isFullScreen: true});
  };

  _handleExitFullScreen = () => {
    this.setState({isFullScreen: false});
  };

  _handleTimeChange = (currentTime) => {
    this.video.setCurrentTime(currentTime);
  };

  _handlePlay = () => {
    this.setState({isPlaying: true});
  };

  _handlePause = () => {
    this.setState({isPlaying: false});
  };

  _handleTimeUpdate = (currentTime, progress, duration) => {
    this.setState({currentTime, progress, duration});
  };

  _handleMute = () => {
    this.setState({isMuted: true});
  };

  _handleUnmute = () => {
    this.setState({isMuted: false});
  };

  _handleEnd = () => {
    this.props.onEnd();
    this.setState({currentTime: 0, progress: 0});
    this.fullScreen.isFullScreen() && this.fullScreen.exit();
    this.hideControls();
  };

  _handleOnMouseMove = (e) => {
    if (this.state.isPlaying) {
      this.showControls();
      this._setHideControlsTimeout();
    }
  };

  render() {
    const props = this.props;
    const state = this.state;

    return (
      <div
        className={`VideoPlayer ${props.className}`}
        style={props.style}
        ref={r => this.container = r}
        onMouseMove={this._handleOnMouseMove}
      >
        {
          props.src &&
          <BackgroundVideo
            ref={r => this.video = r}
            src={props.src}
            containerWidth={state.containerWidth}
            containerHeight={state.containerHeight}
            autoPlay={false}
            muted={props.muted}
            loop={props.loop}
            onPlay={this._handlePlay }
            onPause={this._handlePause}
            onTimeUpdate={this._handleTimeUpdate}
            onMute={this._handleMute}
            onUnmute={this._handleUnmute}
            onEnd={this._handleEnd}
            onClick={this.togglePlay}
            disableBackgroundCover={props.disableBackgroundCover}
            preload={props.preload}
            playsInline={props.playsInline}
            volume={props.volume}
            startTime={state.startTime}
          />
        }
        {
          <TransitionGroup>
            {
              (state.showPoster || (!state.isPlaying && (!state.progress || (props.showPosterOnEnd && state.progress >= 1)))) &&
              <VideoPoster
                poster={props.poster}
                hasPlayButton={props.hasPlayButton}
                playButtonText={state.showPoster ? 'Resume' : 'Play Video'}
                onClick={this.play}
                fadeDuration={props.posterFadeDuration}
                containerWidth={state.containerWidth}
                containerHeight={state.containerHeight}
                shouldPosterCover={props.shouldPosterCover}
              />
            }
          </TransitionGroup>
        }
        {
          props.hasCloseButton &&
          <nav
            className="top half"
            ref={r => this.topNav = r}
          >
            <CloseButton onClick={props.onClose}/>
          </nav>
        }
        <nav
          className="bottom half"
          ref={r => this.controls = r}
        >
          <div className="controls">
            <SlotMachineButton
              className="play button"
              onClick={this.togglePlay}
              isActive={state.isPlaying}
            >
              <SvgContainer svg="pause"/>
              <SvgContainer svg="videoPlay"/>
            </SlotMachineButton>

            <VideoTimeline
              duration={state.duration}
              currentTime={state.currentTime}
              onTimeChange={this._handleTimeChange}
            />
            <time>
              {secondsToTime(this.state.currentTime)}
            </time>

            <SlotMachineButton
              className="mute button"
              onClick={this.toggleMute}
              isActive={state.isMuted}
            >
              <SvgContainer svg="unmute"/>
              <SvgContainer svg="mute"/>
            </SlotMachineButton>

            <SlotMachineButton
              className="fullscreen button"
              onClick={this.toggleFullScreen}
              isActive={state.isFullScreen}
            >
              <SvgContainer svg="exitFullscreen"/>
              <SvgContainer svg="fullscreen"/>
            </SlotMachineButton>
          </div>
        </nav>
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  style: PropTypes.object,
  poster: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  autoPlay: PropTypes.bool,
  autoPlayDelay: PropTypes.number,
  muted: PropTypes.bool,
  loop: PropTypes.bool,
  controlsTimeout: PropTypes.number,
  isControlsVisibleOnLoad: PropTypes.bool,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  hasCloseButton: PropTypes.bool,
  hasPlayButton: PropTypes.bool,
  preload: PropTypes.string,
  showPosterOnEnd: PropTypes.bool,
  playsInline: PropTypes.bool,
  volume: PropTypes.number,
  startTime: PropTypes.number,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onClose: PropTypes.func,
  posterFadeDuration: PropTypes.number,
  shouldPosterCover: PropTypes.bool,
};

VideoPlayer.defaultProps = {
  className: '',
  style: {},
  autoPlay: false,
  autoPlayDelay: 0,
  muted: false,
  loop: false,
  showPosterOnEnd: true,
  controlsTimeout: 2500,
  isControlsVisibleOnLoad: false,
  disableBackgroundCover: true,
  hasCloseButton: false,
  hasPlayButton: true,
  preload: 'auto',
  playsInline: false,
  volume: 1,
  startTime: 0,
  posterFadeDuration: 0,
  shouldPosterCover: false,
  onPlay: f => f,
  onPause: f => f,
  onEnd: f => f,
  onClose: f => f,
};

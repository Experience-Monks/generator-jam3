import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BackgroundVideo from 'react-background-video-player';
import TransitionGroup from 'react-transition-group-plus';
import animate from '@jam3/gsap-promise';
import SVGInline from 'react-svg-inline';

import secondsToTime from '../../../util/seconds-to-minutes';
import fullScreen from '../../../util/handle-fullscreen';

import playIcon from './play.svg';
import pauseIcon from './pause.svg';
import mutedIcon from './muted.svg';
import unMutedIcon from './unmuted.svg';
import enterFsIcon from './enter-fullscreen.svg';
import exitFsIcon from './exit-fullscreen.svg';
import closeIcon from './close.svg';
import captionsOnIcon from './captions-on.svg';
import captionsOffIcon from './captions-off.svg';

import VideoTimeline from './VideoTimeline';
import VideoPoster from './VideoPoster';

export default class VideoPlayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: props.windowWidth || 0,
      containerHeight: props.windowHeight || 0,
      isPlaying: false,
      isMuted: props.muted,
      isFullScreen: false,
      isShowingCaptions: props.captions && props.captions.default,
      currentCaptions: '',
      currentTime: 0,
      progress: 0,
      duration: 0,
      startTime: props.startTime,
    };
  }

  componentDidMount() {
    this.fullScreen = fullScreen(this.container, this._handleEnterFullScreen, this._handleExitFullScreen);

    if (this.props.hasControls) {
      this.props.showControlsOnLoad ? this._setHideControlsTimeout() : this.hideControls(0);
    }

    if (this.props.autoPlay) {
      this.autoPlayTimeout = setTimeout(() => {
        this.play();
        this._clearAutoPlayTimeout();
      }, this.props.autoPlayDelay * 1000);
    }

    if (this.props.captions) {
      this.captionsContainer &&
      animate.set(this.captionsContainer, {autoAlpha: Boolean(this.state.isShowingCaptions)});
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

    if (nextProps.captions && (nextProps.captions.src !== this.props.captions.src)) {
      this._setCaptions(nextProps.captions);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPlaying !== this.state.isPlaying) {
      if (this.state.isPlaying) {
        this.props.onPlay(this.props.id);
        this.props.hasControls && this._setHideControlsTimeout();
      } else {
        this.props.onPause(this.props.id);
        if (this.props.hasControls) {
          this._clearHideControlsTimeout();
          this.showControls();
        }
      }
    }

    if (prevState.isShowingCaptions !== this.state.isShowingCaptions) {
      this.captionsContainer &&
      animate.to(this.captionsContainer, 0.1, {autoAlpha: Boolean(this.state.isShowingCaptions)});
    }
  }

  componentWillUnmount() {
    this.fullScreen.destroy();
    this.pause();
    this._clearAutoPlayTimeout();
    this.props.hasControls && this._clearHideControlsTimeout();
    this.captions && this.captions.removeEventListener('cuechange', this.handleTrackChange);
  }

  showControls = (dur = 0.8, ease = Expo.easeOut) => {
    this.closeButton && animate(this.closeButton, dur, {y: '0%', ease});
    animate(this.controls, dur, {y: '0%', ease});
  };

  hideControls = (dur = 0.8, ease = Expo.easeOut) => {
    this.closeButton && animate(this.closeButton, dur, {y: '-100%', ease});
    animate(this.controls, dur, {y: '100%', ease});
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

  toggleCaptions = () => {
    this.setState({isShowingCaptions: !this.state.isShowingCaptions});
  };

  _setCaptions = (captions = this.props.captions) => {
    const video = this.video.video;
    if (video.contains(this.captions)) {
      video.removeChild(this.captions);
      this.captions.removeEventListener('cuechange', this._handleTrackChange);
    }

    const track = document.createElement('track');
    track.kind = captions.kind;
    track.label = captions.label;
    track.srclang = captions.srclang;
    track.default = captions.default;
    track.src = captions.src;
    track.mode = 'hidden';

    this.captions = track;
    video.appendChild(this.captions);
    video.textTracks[0].mode = 'hidden';

    this.captions.addEventListener('cuechange', this._handleTrackChange);
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
    }, this.props.controlsTimeout * 1000);
  };

  _handleOnReady = () => {
    if (this.props.captions) {
      this.props.captions.src && this._setCaptions();
    }
  };

  _handleTrackChange = () => {
    const trackList = this.video.video.textTracks;
    const textTracks = (trackList && trackList.length > 0) ? trackList[0] : null;
    let cue = (textTracks && textTracks.activeCues.length > 0) ? textTracks.activeCues[0] : null;
    let text = cue ? cue.text : '';
    this.setState({currentCaptions: text});
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
    this.fullScreen.isFullScreen() && this.fullScreen.exit();
    this.props.showPosterOnEnd && this.hideControls();
  };

  _handleOnMouseMove = (e) => {
    if (this.state.isPlaying && this.props.hasControls) {
      this.showControls();
      this._setHideControlsTimeout();
    }
  };

  _handleKeyPress = (e) => {
    if (this.props.allowKeyboardControl) {
      const event = e.keyCode || e.which || e.charCode;
      if (event === 32) {
        this.togglePlay();
      }
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
          <BackgroundVideo
            ref={r => this.video = r}
            src={props.src}
            containerWidth={state.containerWidth}
            containerHeight={state.containerHeight}
            autoPlay={false}
            muted={props.muted}
            loop={props.loop}
            disableBackgroundCover={props.disableBackgroundCover}
            preload={props.preload}
            playsInline={props.playsInline}
            volume={props.volume}
            startTime={state.startTime}
            onReady={this._handleOnReady}
            onPlay={this._handlePlay}
            onPause={this._handlePause}
            onTimeUpdate={this._handleTimeUpdate}
            onMute={this._handleMute}
            onUnmute={this._handleUnmute}
            onEnd={this._handleEnd}
            onClick={props.togglePlayOnClick ? this.togglePlay : f => f}
            onKeyPress={this._handleKeyPress}
          />
        }

        {
          props.poster &&
          <TransitionGroup>
            {
              (!state.isPlaying && (!state.progress || (props.showPosterOnEnd && state.progress >= 1))) &&
              <VideoPoster
                poster={props.poster}
                hasPlayButton={props.hasPlayButton}
                fadeDuration={props.posterFadeDuration}
                onClick={this.play}
              />
            }
          </TransitionGroup>
        }

        {
          props.hasCloseButton &&
          <button
            className="close"
            ref={r => this.closeButton = r}
            aria-label="Close Video"
            onClick={props.onClose}
          >
            <SVGInline svg={closeIcon}/>
          </button>
        }

        {
          props.hasControls &&
          <nav
            className="controls"
            ref={r => this.controls = r}
          >
            <button
              aria-label={state.isPlaying ? 'Pause Video' : 'Play Video'}
              onClick={this.togglePlay}
            >
              <SVGInline svg={state.isPlaying ? pauseIcon : playIcon}/>
            </button>

            <VideoTimeline
              duration={state.duration}
              currentTime={state.currentTime}
              onTimeChange={this._handleTimeChange}
            />

            {
              props.captions &&
              <div
                className="captions-container"
                ref={r => this.captionsContainer = r}
              >
                {this.state.currentCaptions && <p>{this.state.currentCaptions}</p>}
              </div>
            }

            <time tabIndex="0">
              {secondsToTime(this.state.currentTime)}
            </time>

            {
              props.captions &&
              <button
                aria-label={state.isShowingCaptions ? 'Hide Captions' : 'Show Captions'}
                onClick={this.toggleCaptions}
              >
                <SVGInline svg={state.isShowingCaptions ? captionsOnIcon : captionsOffIcon}/>
              </button>
            }

            <button
              aria-label={state.isMuted ? 'Unmute Video' : 'Mute Video'}
              onClick={this.toggleMute}
            >
              <SVGInline svg={state.isMuted ? mutedIcon : unMutedIcon}/>
            </button>

            <button
              aria-label={state.isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              onClick={this.toggleFullScreen}
            >
              <SVGInline svg={state.isFullScreen ? exitFsIcon : enterFsIcon}/>
            </button>
          </nav>
        }

      </div>
    );
  }
}

VideoPlayer.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  preload: PropTypes.string,
  captions: PropTypes.object,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  allowKeyboardControl: PropTypes.bool,
  autoPlay: PropTypes.bool,
  muted: PropTypes.bool,
  loop: PropTypes.bool,
  togglePlayOnClick: PropTypes.bool,
  showControlsOnLoad: PropTypes.bool,
  hasCloseButton: PropTypes.bool,
  hasPlayButton: PropTypes.bool,
  showPosterOnEnd: PropTypes.bool,
  hasControls: PropTypes.bool,
  playsInline: PropTypes.bool,
  autoPlayDelay: PropTypes.number,
  controlsTimeout: PropTypes.number,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  volume: PropTypes.number,
  startTime: PropTypes.number,
  posterFadeDuration: PropTypes.number,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onClose: PropTypes.func,
};

VideoPlayer.defaultProps = {
  className: '',
  style: {},
  id: '',
  togglePlayOnClick: true,
  allowKeyboardControl: true,
  autoPlay: false,
  autoPlayDelay: 0, // in seconds
  muted: false,
  loop: false,
  hasControls: true,
  showPosterOnEnd: false,
  controlsTimeout: 3, // in seconds
  showControlsOnLoad: false,
  disableBackgroundCover: true,
  hasCloseButton: false,
  hasPlayButton: true,
  preload: 'auto',
  playsInline: false,
  volume: 1,
  startTime: 0,
  posterFadeDuration: 0,
  onPlay: f => f,
  onPause: f => f,
  onEnd: f => f,
  onClose: f => f,
};

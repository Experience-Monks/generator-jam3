import React from 'react';
import PropTypes from 'prop-types';
import detect from '../../util/detect';

class MobileFsVideo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.isIOS = detect.os.toLocaleLowerCase() === 'ios';
  }

  componentDidMount() {
    if (this.isIOS) {
      this.video.addEventListener('webkitendfullscreen', this.handleIOSExit);
    } else {
      this.video.addEventListener('fullscreenchange', this.handleFullScreenChange);
      this.video.addEventListener('webkitfullscreenchange', this.handleFullScreenChange);
    }
  }

  componentWillUnmount() {
    if (this.isIOS) {
      this.video.removeEventListener('webkitendfullscreen', this.handleIOSExit);
    } else {
      this.video.removeEventListener('fullscreenchange', this.handleFullScreenChange);
      this.video.removeEventListener('webkitfullscreenchange', this.handleFullScreenChange);
    }
  }

  play = () => {
    if (this.isIOS) {
      this.props.onOpen();
    }

    process.nextTick(() => { // keep next tick for dynamic source swap
      this.requestFullScreen();
      this.video.play();
    });
  };

  pause = () => {
    this.video.pause();
  };

  requestFullScreen = () => {
    const el = this.video;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.webkitEnterFullScreen) {
      el.webkitEnterFullScreen();
    }
  };

  exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (this.video.webkitExitFullScreen) {
      this.video.webkitExitFullScreen();
    }
  };

  isFullScreen = () => {
    if (document.fullscreen !== undefined) {
      return document.fullscreen;
    }
    if (document.mozFullScreen !== undefined) {
      return document.mozFullScreen;
    }
    if (document.webkitIsFullScreen !== undefined) {
      return document.webkitIsFullScreen;
    }
  };

  getVideoElement = () => {
    return this.video;
  };

  handleIOSExit = () => {
    this.pause();
    this.props.onClose();
  };

  handleFullScreenChange = () => {
    if (this.isFullScreen()) {
      this.props.onOpen();
    } else {
      this.pause();
      this.props.onClose();
    }
  };

  handleEnded = () => {
    this.exitFullScreen();
  };

  render() {
    const style = Object.assign({}, {
      position: 'fixed',
      width: 0,
      height: 0,
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
    }, this.props.style);

    const className = 'MobileFsVideo';

    return (
      <video
        style={style}
        className={`${className} ${this.props.className}`}
        src={this.props.src}
        ref={r => this.video = r}
        onEnded={this.handleEnded}
      />
    );
  }
}

MobileFsVideo.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  src: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

MobileFsVideo.defaultProps = {
  style: {},
  className: '',
  src: '',
  onOpen: f => f,
  onClose: f => f,
};

export default MobileFsVideo;

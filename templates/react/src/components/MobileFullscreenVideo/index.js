import React from 'react';
import PropTypes from 'prop-types';
import fullScreen from 'fullscreen-handler';

import detect from '../../util/detect';

const isIOS = detect.isIOS;

class MobileFullscreenVideo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fullScreen = fullScreen(this.video,
      this.handleFsEnter,
      this.handleFsExit,
    );
  }

  componentWillUnmount() {
    this.fullScreen.destroy();
  }

  play = () => {
    process.nextTick(() => {
      isIOS && this.props.onOpen();
      this.fullScreen.enter();
      this.video.play();
    });
  };

  pause = () => {
    this.video.pause();
  };

  getVideoElement = () => {
    return this.video;
  };

  handleFsEnter = () => {
    !isIOS && this.props.onOpen();
  };

  handleFsExit = () => {
    this.pause();
    this.props.onClose();
  };

  handleEnded = () => {
    this.fullScreen.exit();
  };

  render() {
    const style = Object.assign({}, {
      position: 'fixed',
      width: 0,
      height: 0,
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
    }, this.props.style);

    return (
      <video
        style={style}
        className={`MobileFullscreenVideo ${this.props.className}`}
        src={this.props.src}
        ref={r => this.video = r}
        onEnded={this.handleEnded}
      />
    );
  }
}

MobileFullscreenVideo.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  src: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

MobileFullscreenVideo.defaultProps = {
  style: {},
  className: '',
  src: '',
  onOpen: f => f,
  onClose: f => f,
};

export default MobileFullscreenVideo;

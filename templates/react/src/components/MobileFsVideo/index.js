import React from 'react';
import PropTypes from 'prop-types';
import fullScreen from 'fullscreen-handler';

const isIOS = Boolean(typeof navigator !== 'undefined' && navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/));

class MobileFsVideo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fullScreen = fullScreen(this.video,
      this._handleFsEnter,
      this._handleFsExit,
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

  _handleFsEnter = () => {
    !isIOS && this.props.onOpen();
  };

  _handleFsExit = () => {
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

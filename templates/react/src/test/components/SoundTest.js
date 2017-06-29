import React from 'react';
import audio from '../../util/audio';

const path = process.env.ASSET_PATH + 'sounds/';
const data = {
  rain: {
    src: [`${path}test-noise.mp3`],
    loop: true,
    autoplay: true,
  },
  'thunders': {
    src: `${path}test-sprite.mp3`,
    sprite: {
      'thunder-1': [0, 13767],
      'thunder-2': [13767, 8000],
    }
  },
};

export default class VideoTest extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAmbientMuted: false,
    };

    audio.extraData = data;
    this.ambientSound = audio.sounds['rain'];
  }

  componentDidMount() {
    this.ambientSound.load();
    this.ambientSound.fade(0, 0.5, 2000);
  }

  componentWillUnmount() {
    this.ambientSound.unload();
    audio.sounds['thunders'].unload();
  }

  handleMuteClick = () => {
    const isAmbientMuted = !this.state.isAmbientMuted;
    const fadeFrom = isAmbientMuted ? 0.5 : 0;
    const fadeTo = isAmbientMuted ? 0 : 0.5;
    const fadeDuration = isAmbientMuted ? 500 : 2000;

    this.setState({isAmbientMuted});
    audio.play('button-click');
    this.ambientSound.fade(fadeFrom, fadeTo, fadeDuration);
  };

  render() {
    const containerStyles = {
      padding: 20,
    };

    const headingStyles = {
      margin: '20px 0'
    };

    const buttonStyles = {
      padding: '20px 50px',
      marginRight: 20,
      color: '#fff',
      background: '#000',
      border: '1px solid #fff'
    };
    
    const buttonProps = {
      onMouseEnter: () => audio.play('button-rollover'),
      style: buttonStyles,
    };

    return (
      <div>
        <div style={containerStyles}>
          <button onClick={this.handleMuteClick} {...buttonProps}>
            {this.state.isAmbientMuted ? 'Unmute' : 'Mute'} Rain
          </button>
        </div>
        <br/>
        <div style={containerStyles}>
          <h2 style={headingStyles}>Test Sprites</h2>
          <button onClick={() => audio.play('thunder-1')} {...buttonProps}>L Thunder</button>
          <button onClick={() => audio.play('thunder-2')} {...buttonProps}>R Thunder</button>
        </div>
      </div>
    );
  }
}

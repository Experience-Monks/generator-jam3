import React from 'react';
import audio from '../../util/audio';

const path = process.env.ASSET_PATH + 'sounds/';

const data = {
  'button': {
    src: `${path}button-sprite.mp3`,
    sprite: {
      'sprite-rollover': [0, 50],
      'sprite-click': [60, 100],
    }
  },
};

export default class SoundTest extends React.PureComponent {
  constructor(props) {
    super(props);
    audio.extraData = data;
  }

  render() {
    const containerStyles = {
      padding: 20,
    };

    const buttonStyles = {
      padding: '20px 50px',
      marginRight: 20,
      color: '#fff',
      background: '#000',
      border: '1px solid #fff',
      fontSize: 18
    };

    return (
      <div>
        <div style={containerStyles}>
          <button
            style={buttonStyles}
            onMouseEnter={() => audio.play('button-rollover')}
            onClick={() => audio.play('button-click')}
          >
            Test singe sounds
          </button>
        </div>
        <br/>
        <div style={containerStyles}>
          <button
            style={buttonStyles}
            onMouseEnter={() => audio.play('sprite-rollover')}
            onClick={() => audio.play('sprite-click')}
          >
            Test sprite sounds
          </button>
        </div>
      </div>
    );
  }
}

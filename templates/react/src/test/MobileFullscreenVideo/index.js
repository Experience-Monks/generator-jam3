import React from 'react';
import PropTypes from 'prop-types';
import MobileFsVideo from '../../components/MobileFullscreenVideo{{#if sectionNames}}/MobileFullscreenVideo{{/if}}';

class MobileFullscreenVideoTest extends React.PureComponent {

  handleOnClick = () => {
    this.video.play();
  };

  render() {
    const props = this.props;

    return (
      <div
        style=\{{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          fontSize: 18
        }}
      >
        <button
          style=\{{
            width: '200px',
            height: '50px',
            color: '#fff',
            background: '#212121',
            textAlign: 'center'
          }}
          onClick={this.handleOnClick}
        >
          Play Video
        </button>

        <MobileFsVideo
          ref={r => this.video = r}
          src={props.src}
        />
      </div>
    );
  }
}

MobileFullscreenVideoTest.propTypes = {
  src: PropTypes.string.isRequired,
};

MobileFullscreenVideoTest.defaultProps = {};

export default MobileFullscreenVideoTest;

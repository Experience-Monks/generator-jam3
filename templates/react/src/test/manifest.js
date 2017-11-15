/**
 * Components added to the manifest can be accessed in browser under `/test/{componentName}` route
 * or go to `/test` to see the list of test components
 */

import detect from '../util/detect';

export default {
  Rotate: {
    component: require('../components/Rotate{{#if sectionNames}}/Rotate{{/if}}'),
    props: {
      portrait: true
    }
  },
  Preloader: {
    component: require('./components/Preloader'),
    props: {
      minDisplayTime: 1500,
    }
  },
  VideoPlayerFullBrowser: {
    component: require('../components/VideoPlayer{{#if sectionNames}}/VideoPlayer{{/if}}'),
    props: {
      autoPlay: true,
      playsInline: true,
      disableBackgroundCover: false,
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
      hasControls: true,
      hasCloseButton: true,
      hasPlayButton: false,
      showControlsOnLoad: true,
      togglePlayOnClick: detect.isDesktop,
      captions: {
        kind: 'captions',
        label: 'English',
        srclang: 'en',
        default: false,
        src: process.env.ASSET_PATH + 'videos/captions-test.vtt',
      },
    }
  },
  VideoPlayerBg: {
    component: require('../components/VideoPlayer{{#if sectionNames}}/VideoPlayer{{/if}}'),
    props: {
      autoPlay: true,
      loop: true,
      playsInline: true,
      muted: true,
      togglePlayOnClick: false,
      allowKeyboardControl: false,
      disableBackgroundCover: false,
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
      hasControls: false,
      hasCloseButton: false,
      hasPlayButton: false,
    }
  },
  VideoPlayerInline: {
    component: require('../components/VideoPlayer{{#if sectionNames}}/VideoPlayer{{/if}}'),
    props: {
      style: {
        width: detect.isDesktop ? 768 : 320,
        height: detect.isDesktop ? 432 : 180,
        margin: 'auto'
      },
      togglePlayOnClick: detect.isDesktop,
      playsInline: true,
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
      poster: 'http://il6.picdn.net/shutterstock/videos/3548084/thumb/1.jpg',
      hasPlayButton: true,
      showPosterOnEnd: true,
      showControlsOnLoad: false,
      disableBackgroundCover: true,
    }
  },
  MobileFullscreenVideo: {
    component: require('./MobileFullscreenVideo'),
    props: {
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
    }
  },
  HamburgerButton: {
    component: require('./components/HamburgerButton'),
    props: {}
  },
  SoundTest: {
    component: require('./components/SoundTest'),
  }
};

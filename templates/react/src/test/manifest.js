/**
 * Components added to the manifest can be accessed in browser under `/test/{componentName}` route
 * or go to `/test` to see the list of test components
 */

export default {
  Rotate: {
    component: require('../components/Rotate{{#if sectionNames}}/Rotate{{/if}}'),
    props: {
      portrait: true
    }
  },
  Preloader: {
    component: require('./Preloader') // example of using a wrapper component connected to the store
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
        width: 768,
        height: 432,
      },
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
      poster: 'http://il6.picdn.net/shutterstock/videos/3548084/thumb/1.jpg',
      hasPlayButton: true,
      showPosterOnEnd: true,
      showControlsOnLoad: false,
      disableBackgroundCover: true,
    }
  },
};

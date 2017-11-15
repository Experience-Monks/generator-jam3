/**
 * Components added to the manifest can be accessed in browser under `/test/{componentName}` route
 * or go to `/test` to see the list of test components
 */

import detect from '../util/detect';

const manifest = [
  {
    key: 'rotate',
    Component: require('../components/Rotate{{#if sectionNames}}/Rotate{{/if}}').default,
    props: {
      portrait: true
    }
  },
  {
    key: 'preloader',
    Component: require('./components/Preloader').default,
    props: {
      minDisplayTime: 1500
    }
  },
  {
    key: 'vp-full',
    Component: require('../components/VideoPlayer{{#if sectionNames}}/VideoPlayer{{/if}}').default,
    props: {
      style: { height: window.innerHeight },
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
        src: process.env.ASSET_PATH + 'videos/captions-test.vtt'
      }
    }
  },
  {
    key: 'vp-bg',
    Component: require('../components/VideoPlayer{{#if sectionNames}}/VideoPlayer{{/if}}').default,
    props: {
      style: { height: window.innerHeight },
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
      hasPlayButton: false
    }
  },
  {
    key: 'vp-inline',
    Component: require('../components/VideoPlayer{{#if sectionNames}}/VideoPlayer{{/if}}').default,
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
      disableBackgroundCover: true
    }
  },
  {
    key: 'vp-mobile',
    Component: require('./components/MobileFullscreenVideo').default,
    props: {
      style: { height: window.innerHeight },
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4'
    }
  },
  {
    key: 'hamburger-button',
    Component: require('./components/HamburgerButton').default,
    props: {}
  },
  {
    key: 'sound',
    Component: require('./components/SoundTest').default,
    props: {}
  }
];

export default manifest
  .concat({
    key: 'test-index-page',
    Component: require('./components/TestPage').default,
    path: {
      path: '/test',
      exact: true
    }
  })
  .map(route => ({
    path: {
      path: '/test/' + route.key,
      exact: true,
    },
    ...route
  }));

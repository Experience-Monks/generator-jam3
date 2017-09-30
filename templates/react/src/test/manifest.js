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
    component: require('./components/Preloader') // example of using a wrapper component connected to the store
  },
   SoundTest: {
    component: require('./components/SoundTest'),
  }
};
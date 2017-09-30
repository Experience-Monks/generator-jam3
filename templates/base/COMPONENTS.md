[Back](README.md) | [Scripts](SCRIPTS.md)  
# Components

##### Table of Contents  
- [Preloader](#preloader)  
- [Rotate Screen](#rotate)  
- [Video Player](#video-player)
- [Mobile Fullscreen Video](#mobile-fs-video)
- [Hamburger Button](#hamburger-button) 
- [Device Detection](#device)  
- [Stats](#stats)  
- [Unsupported Page](#unsupported)  
- [Meta](#meta)
- [Audio](#audio)

<a name="preloader"></a>
## Preloader (components/Preloader)
The preloader component is built on the top of [preloader module](https://www.npmjs.com/package/preloader). Please refer to it for more information.

#### Setup
Specify files or folders (to be read recursively) using glob format in `config-preloader.json` in the root of the project. 
Example preloader json file:
```
[
  "json/**/*"
]
```

On `npm start` the preloader script will be executed and `preloader-list.json` will be created in `raw-assets` folder with the list of files to be loaded, excluding any junk files.

**Important:** 
* Do not include `assets` folder in the paths of config file
* Newly added assets won't affect the preloader list until node script restarted

#### Props
- `assetsList` (Required) - an array of assets to be loaded. It automatically determines the loader to be used based on file extension (json, mp4, etc.)
- `minDisplayTime` - min time (in milliseconds) for the preloader to be shown
- `options` - an object that contains the following properties:

            - `xhrImages` - loads images via XHR and converts to a Blob instead of the image tag. Default: `false`
            - `loadFullAudio` - specifies is audio should be loaded in full instead of just to the point where they can play. Default: `false`
            - `loadFillVideo` - specifies is video should be loaded in full instead of just to the point where they can play. Default: `false`
            - `onComplete` - function to attach to the complete event
            - `onProgress` - function to attach to the progress event

#### API
Follows [preloader](https://www.npmjs.com/package/preloader) API for the corresponding methods:

- `add`
- `get`
- `load`
- `stopLoad`

<a name="rotate"></a>
## Rotate Screen (components/Rotate)

The rotate screen component simply needs to be included on the page. It determines the device orientation via the detect utility. It will determine if it needs to be shown based the boolean prop.

#### Props
- `portrait` - Boolean which determines if the site is locked to portrait or not. If `true`, the rotate screen will display if the device is in landscape mode, otherwise it will display if the device is in portrait mode. Default: true

<a name="video-player"></a>
## Video Player (components/VideoPlayer)
This is basic video player that includes `VideoTimeline` and `VideoPoster` components.
It is accessible and allows to be controlled using keyboard.

#### Props
- `src` - *String* (required) - video source
- `poster` - *String* -  poster image
- `id` - - *String* or *Number* - video ID that will be sent back with `onPlay` hook 
- `preload` - *String* - determines whether video should automatically preload. Valid options are `auto`, `metadata` or `none`
- `captions` - *Object* - track data refer to https://developer.mozilla.org/en/docs/Web/HTML/Element/track
- `disableBackgroundCover`- *Boolean* - disable video cover effect
- `allowKeyboardControl` - *Boolean* - allow/disallow toggle play state with space bar when video element is focused
- `autoPlay` - *Boolean* - determines whether video should automatically play on load
- `muted` - *Boolean* - determines whether video should play sound
- `loop` - *Boolean* - determines whether video should loop
- `togglePlayOnClick` - *Boolean* - allow/disallow toggle play state on video click
- `showControlsOnLoad` - *Boolean* - determines whether to show video controls on load without mouse interaction
- `hasCloseButton` - *Boolean* - render close button that is synced with controls
- `hasPlayButton` - *Boolean* - render play button for video poster
- `showPosterOnEnd` - *Boolean* - determines whether poster should show up after video has ended
- `hasControls` - *Boolean* - render controls
- `playsInline` - *Boolean* - determines if video plays inline on iPhone
- `autoPlayDelay` - *Number* - auto play delay (in milliseconds). Only works with `autoPlay: true`
- `controlsTimeout` - *Number* - time (in milliseconds) after which controls and close button hide if the user was inactive 
- `windowWidth` - *Number* - window width. It is required when for background cover videos - `disableBackgroundCover: false`
- `windowHeight` - *Number* - window height. It is required when for background cover videos - `disableBackgroundCover: false`
- `volume` - *Number* - values from 0 to 1
- `startTime` - *Number* - video start time (in seconds)
- `posterFadeDuration` - *Number* - poster fade out duration (in milliseconds)
- `onPlay` - *Function* - on video play hook
- `onPause` - *Function* - on video pause hook
- `onEnd` - *Function* - on video end hook
- `onClose` - *Function* - on close button click hook

#### API
- `showControls` - force controls to show
- `hideControls`- force controls to hide
- `getVideoElement` - access HTML video
- `play`
- `pause`
- `mute`
- `unmute`
- `togglePlay`
- `toggleMute`
- `toggleFullScreen`
- `toggleCaptions` - show/hide captions

<a name="mobile-fs-video"></a>
## Mobile Fullscreen Video (components/MobilFsVideo)
Component that triggers video to go fullscreen on Android and play in native browser on iOS

#### Props
- `src` - *String* - video source
- `onOpen` *Function* - fullscreen enter (native player open) hook
- `onClose` *Function* - fullscreen exit (native player close) hook

#### API
- `play`
- `pause`
- `getVideoElement` - access HTML video
  

<a name="hamburger-button"></a>
## Hamburger Button (components/HamburgerButton)

#### Props
- `className` - *String* - additional class name
- `style` - *Object* - additional styles
- `tabIndex` - *Number* - container's tab index
- `state` - *String* - one of the 3 available states: `idle`, `close` or `back`
- `activeState` - *String* - the active state, `close` or `back`
- `isMouseOver` - *Boolean* - force mouse over state
- `onClick` - *Function* - `click` hook
- `onMouseEnter` - *Function* - `mouseenter` hook
- `onMouseLeave` - *Function* - `mouseleave` hook

<a name="device"></a>
## Device Detection (util/detect.js)

The device detection utility is a javascript object with numerous properties to help you build conditionals based on the current browser / device. It includes the following properties.
- `isBot` - Detect if is a crawler bot,
- `isFacebook` - Detect if in-app Facebook browser,
- `isTwitter` - Detect if in-app Twitter browser,
- `isInstagram` - Detect if in-app Instagram browser,
- `isPinterest` - Detect if in-app Pinterest browser,
- `isInAppBrowser` - Detect if browser is in-app,
- `inAppBrowserVersion` - in-app browser version,
- `device` - returns either `phone`, `tablet`, or `desktop`  
- `vendor` - vendor name of the browser (i.e. "google inc.")  
- `os` - Returns the current operating system  
- `osVersion` - Returns the version of the current operating system  
- `browser` - Returns the current browser  
- `browserVersion` - Returns the version of the current browser  
- `manufacturer` - Returns the manufacturer of the current device  
- `devicePixelRatio` - Returns the current devicePixelRatio of the current screen  
- `classes` - Classes returns an array of classes to add to the body / html element to allow for easy conditional logic in css. These include device type, browser, and pixel ratio  
- `isMobile` - Boolean that describes if the device is a phone or a tablet  
- `isPhone` - Boolean that describes if the device is a phone  
- `isTablet` - Boolean that describes if the device is a tablet  
- `isDesktop` - Boolean that describes if the device is a desktop computer  
- `isChrome` - Boolean that describes if browser is Chrome  
- `isIE` - Boolean that describes if browser is Internet Explorer  
- `isEdge` - Boolean that describes if browser is Microsoft Edge  
- `isFirefox` - Boolean that describes if browser is Firefox  
- `isSafari` - Boolean that describes if browser is Safari  
- `isOpera` - Boolean that describes if browser is Opera  
- `md` - The [mobile-detect](npmjs.com/mobile-detect) object used in the device detection
- `bowser` - The [bowser](npmjs.com/bowser) object used in the device detection
- `orientation` - String that returns either `portrait` or `landscape` 
  
<a name="stats"></a>
## Stats (util/stats.js)

A simple utility that tracks browser framerate. The script simply needs to be included and executed. This is already done for you in `index.js` and is currently setup to only display in the development environment.

<a name="unsupported"></a>
## Unsupported Page

The unsupported page is automatically redirected to via PHP. This is determined via `device-matrix.json` in the static folder of the project. Specify your minimum browser versions in the json. You can style your page by modifying `unsupported.html` also in the static folder of the project. Here is an example of the device-matrix.json:

```
{
  "ie": 11,
  "safari": 8,
  "chrome": 47,
  "firefox": 42
}
```

This will ensure the browser is at a minimum, Internet Explorer 11, Safari 8, Chrome 47 or Firefox 42, otherwise it will redirect to the unsupported page.  

<a name="meta"></a>
## Meta

Meta.php takes care of automatically populating Open Graph, Twitter Card data, and regular meta tags. Simply specify your routes with the accompanying title, description, and image in the share.json in the static folder and the rest will be taken care of. title, image, and description will automatically be spread across Open Graph, Twitter Card and regular meta tags. You can add any meta property into the json and it will be parsed and added as a meta tag. Here is an example share.json:

```
{
  "default": {
    "image": "http://www.jam3.com/wp-content/uploads/2014/05/jam3_fb.jpg",
    "title": "Jam3 | Toronto Digital Design and Development Agency",
    "description": "Jam3 is one of the world’s top digital production and design agencies. We specialize in creating highly advanced, experiential works in both the advertising and entertainment industries.",
    "og:site_name": "Jam3.com",
    "twitter:site": "@Jam3",
    "twitter:creator": "@Jam3"
  },
  "about": {
    "title": "About - Jam3.com",
    "description": "“It&#8217;s not wise to violate rules until you know how to observe them.” Keep reading"
  }
}
```

<a name="audio"></a>
## Audio (util/audio.js)

This is a Howler wrapper that reads sounds manifest - `data/sounds.js` and sets `Howl` instances for each manifest entry.

Example manifest:
```javascript
{
  'button-rollover': '{{path}}/rollover.mp3',
  'button-click': ['{{path}}/click.wav', '{path}/click.mp3']
  'sprite': {
    src: '{{path}}/sprite.mp3',
    sprite: {
      'chunk-1': [0, 3000],
      'chunk-1': [3000, 2000]
    }
  },
  'ambient': {
    src: '{{path}}/ambient.mp3',
    loop: true,
    autoplay: true
  }
}
```

if manifest item is type of `String` or `Array`, then it will be used as source(s) and a `Howl` will be set up with it's default options.
If manifest entry in type of `Object`, its property will be merged with Howler defaults.

This utility is using Singleton pattern, so it will be initialized once upon first `import/require`. 
Thus, be careful with `preload` and `autoplay` options combination because if both are set to true for a sound, it will start playing on app initialization.

**NOTE**: `preload` option is set to `false` for all sounds by default but can overridden via in manifest for specific sounds.
You can also use `load` function for dynamic loading control. Refer to [Howler API](https://github.com/goldfire/howler.js#documentation).

#### API
* `sounds` (getter) -  Get specific sound from the map by ID e.g. `audio.sounds['some-sound'].play()`

* `extraData` (setter) -  Update sound model. It won't replace the original data unless you overwrite existing in manifest keys e.g. `audio.extraData = {noise: '{path}noise.wav'}`

* `play` - play sound or sprite by `ID` e.g. ```audio.play('button-click')``` or ```audio.play('chunk-1')```

#### Example
Take a look at code example `test/components/SoundTest.js`

See in action in your browser http://localhost:9966/test/SoundTest

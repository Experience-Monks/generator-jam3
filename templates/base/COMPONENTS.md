[Back](README.md) | [Scripts](SCRIPTS.md)  
# Components

##### Table of Contents  
[Preloader](#preloader)  
[Rotate Screen](#rotate)  
[Device Detection](#device)  
[Stats](#stats)  
[Unsupported Page](#unsupported)  
[Meta](#meta)

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

<a name="device"></a>
## Device Detection (util/detect)

The device detection utility is a javascript object with numerous properties to help you build conditionals based on the current browser / device. It includes the following properties.

- `device` - String that returns either `phone`, `tablet`, or `desktop`  
- `vendor` - Vendor name of the browser (i.e. "Google Inc.")  
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
- `md` - The [mobile-detect](npmjs.com/mobile-detect) object used in the device detection
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

[Back](README.md)  
# Scripts

##### Table of Contents  
[config.json](#config)  
[Favicons](#favicons)  
[Lowercase](#lowercase)  
[Facebook Open Graph](#facebook)  

<a name="config"></a>
## config.json

The config.json in the root of the project controls how all the scripts function. Here is the default setup for the config.json:

```
{
  "defaults": {
    "entry": "./src/index.js",
    "vendor": "vendor.js",
    "bundle": "bundle.js",
    "static": "./static/",
    "raw": "./raw-assets/",
    "style": "./src/style/main.scss",
    "ASSET_PATH": "./assets/",
    "BASENAME": "/",
    "JPEG_QUALITY": 80,
    "templateBlacklist": [],
    "htpasswd": false,
    "env": {}
  },
  "development": {
    "output": "./build/"
  },
  "production": {
    "timestamp": true,
    "output": "./release/",
    "minify": true,
    "removeLogs": true
  }
}
```

All variables are able to be overridden, as you can see via the development and production properties. These properties relate to the NODE_ENV variable. By default `npm start` sets NODE_ENV=development and `npm run release` sets NODE_ENV=production.

Here is a breakdown of what each properties controls.

`entry` - The entry point for your app  
`vendor` - The name of your vendor.js file, all npm modules will be bundled into this file, setting it to `false` will put everything into the bundle.js  
`bundle` - The name of the bundle.js  
`static` - The folder containing static html / server files  
`raw` - The folder container raw-assets, such as images, asset related json files and 3d assets  
`style` - The entry point for your less / scss files  
`ASSET_PATH` - Where raw-assets will live in the end, useful to edit this if assets will live on a CDN  
`BASENAME` - If your project will live in a subfolder, specify that here, with a trailing slash  
`JPEG_QUALITY` - The quality to compress JPEG's in the raw-assets folder to, set to `false` to disable JPEG compression  
`templateBlacklist` - Files in the static folder to skip handlebars template compilation, this is only needed if a file breaks handlebars compilation  
`htpasswd` - Where the .htpasswd will live on your production environment
`env` - Any custom variables to use via envify, allows you to access them via `process.env.MY_CUSTOM_VAR`  
`output` - The folder to place all processed files in  
`minify` - Whether to minify the released javascript files, useful for debugging  
`removeLogs` - Whether to remove console commands from the final build  
`timestamp` - Whether to add a build signature to assets and compiled javascript / css files. `true` will add a timestamp to the path, a string will simply append that string to the path, and false will not add a build signature  

To add a new environment, simply specify it in the config.json and then create a new entry for the script in the package.json. Here is an example adding a staging environment.

config.json
```
{
  "defaults": {...},
  "development": {...},
  "production": {...},
  "staging": {
    "timestamp": false,
    "minify": true,
    "removeLogs": true
  }
}
```

package.json
```
"staging": "npm run preloader-release && npm run release-clean && node scripts/style.js --env=staging && node scripts/release.js --env=staging && npm run release-copy && npm run release-gzip"
```

<a name="favicons"></a>
## Favicons `npm run favicons`

#### Default setup
After generating the scaffolding, you will have favicons setup for all the common devices (iOS, Android, Windows Phone and Desktop)

#### Customize
You can change the default configuration by modifying the file `/scripts/favicons/faviconDescription.json`. All the available option are described in (here)[http://realfavicongenerator.net/api/non_interactive_api](http://realfavicongenerator.net/api/non_interactive_api).
If you want to change the image, you can replace the image located in `/scripts/favicons/favicon_template.png` for your new favicon image. The recommended size for this master image is `500x500`.
After changing all the things you want, just run `npm run update-favicons` and you will get your new favicons ready.

<a name="lowercase"></a>
## Lowercase `npm run lowercase`

The lowercase script is a simple utility that will lowercase and replace spaces with dashes for all files within the raw-assets folder. This is useful if you have been handed assets from external sources with inconsistent naming conventions.

<a name="facebook"></a>
## Facebook Open Graph `npm run facebook`

`npm run facebook -- --url=[YOUR URL]`

The Facebook script will clear the Facebook sharing cache for all URL's in your share.json, as well as the base URL you specify in the script. Simply provide your base URL to the script and it will begin clearing the cache for that domain. Here is an example:

share.json
```
{
  "default": {...},
  "gallery: {...},
  "gallery/grid": {...}
}
```

`npm run facebook -- --url=http://my-page-url.com/`

Running this command with this share.json will clear the following URLs from the facebook cache:

```
http://my-page-url.com/
http://my-page-url.com/gallery
http://my-page-url.com/gallery/grid
```
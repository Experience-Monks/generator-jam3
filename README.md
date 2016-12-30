# nyg-jam3

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Jam3 project scaffold based on [nyg](https://www.npmjs.com/package/nyg). Used to create the basic files needed for a Jam3 project.

## Usage

[![NPM](https://nodei.co/npm/nyg-jam3.png)](https://www.npmjs.com/package/nyg-jam3)

The nyg generator is designed to function similar to yeoman. To get it running, simply follow these steps:

```bash
npm i nyg -g
npm i nyg-jam3 -g
cd your-project-directory
nyg nyg-jam3
```

You will then be prompted with a number of questions, which will define the project. The appropriate files will then be copied to the current directory and it will install all your needed dependencies. Congratulations, you are now setup with the basis of a Jam3 project. 

## Prompts

`What is your name? (Author)`  
Default: Jam3  
A name used in the README.md, package.json and humans.txt.

`What is your email? (Author Email)`  
Default: td@jam3.com  
An email used in the package.json and humans.txt.

`Describe the project:`  
Default: A Jam3 project  
A brief description of the project that is used at the top of the README.md.

`What is your git repository? (GitHub Repository)`  
Default: (empty string)  
The git repository used for the project, used within the package.json.

`What framework will your project use?"`  
Default: React  
The framework that this project will be based on, all necessary files and modules will be downloaded to get you up and running with the selected framework. Currently supports React, Bigwheel, or None. In the case of None, source files won't be created, but all the common development scripts will still be setup.

`Would you perfer Landing/Landing.js over Landing/index.js?`  
Default: false  
Whether file names will follow the convention of [folder name]/[folder name].js or [folder name]/index.js.

`Use push states?`  
Default: true  
Whether to use push states in the application, if false, uses hashbangs. This will setup the proper configuration in the framework and the .htaccess file.

`Would you like to use ES6?`  
Default: true  
Whether to use ES6 and babel transpilation. Sets up a .babelrc file and all necessary dependencies.

`What css preprocessor will your project use?`  
Default: SCSS  
Which css preprocessor should be setup on the project, defaults to SASS, but LESS is also an option.

`Separate common npm modules into vendor.js?`  
Default: true  
Whether to separate all npm modules into a separate vender.js file, limiting the bundle.js file to just custom code. 

`How would you like to implement an unsupported page redirect?`  
Default: PHP  
Whether to setup an automatic page redirect for unsupported devices, this will create json file where you can specify which browsers are supported.

`Choose the password to use for password protection. (leave blank to disable)`  
Default: (empty string)  
If you want to enable password protection via .htaccess, simply type the password you would like to use and the .htaccess and .htpasswd files will be created.

`Where on the server will your .htpasswd be located?`  
Default: /var/www  
If you opted to add password protection, this will need to be set to the location of the .htpasswd file in your production environment.

## Setup Favicons

#### Default setup
After generating the scaffolding, you will have favicons setup for all the common devices (iOS, Android, Windows Phone and Desktop)

#### Customize
You can change the default configuration by modifying the file `/scripts/favicons/faviconDescription.json`. All the available option are described in (here)[http://realfavicongenerator.net/api/non_interactive_api](http://realfavicongenerator.net/api/non_interactive_api).
If you want to change the image, you can replace the image located in `/scripts/favicons/favicon_template.png` for your new favicon image. The recommended size for this master image is `500x500`.
After changing all the things you want, just run `npm run update-favicons` and you will get your new favicons ready.

## Preloader (React component)
Preloader Rect component is built on the top of [preloader module](https://www.npmjs.com/package/preloader). Please refer to it for more information.

#### Setup
Specify files or folders (to be read recursively) using glob format in `config-preloader.json` in the root of the project. 
Example preloader json file:
```
[
  "videos/test.mp4",
  "json/",
  "sound",
  "images/test.jpg"
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

## License

MIT, see [LICENSE.md](http://github.com/Jam3/generator-jam3/blob/master/LICENSE.md) for details.

# {{repoName}}

{{description}}

## Developers
{{author}}

## Dependencies list
[http://jam3-license.herokuapp.com/projects/{{repoName}}/licenses](http://jam3-license.herokuapp.com/projects/{{repoName}}/licenses)

Note: If the link is broken use http://jam3-license.herokuapp.com/projects/[repo name]/licenses ?

## PROJECT DOCUMENTATION


## GIT

```
git checkout {{repo}}
```

## Setup

```bash
$ npm install
```

Folder Structure
```bash
raw-assets/json/ 		// Any static json files
raw-assets/images/		// Images that should not be texture packed
raw-assets/videos/
raw-assets/sounds/
raw-assets/fonts/
raw-assets/tp/			// Folder for the .tps files
raw-assets/tp/common/	// Folder containing images to be texture packed,
						// folder name should share the name of the tps file
```

## Run

```bash
$ npm start
```

## Development

Javascript Style Guide: https://github.com/Jam3/Javascript-Code-Conventions

CSS Style Guide: https://github.com/Jam3/CSS-Style-Guide

### IMAGES

Name images using dashes:
- large-pixel-image.png
- cute-yellow-pepper.png

### GLOBAL VARIABLES

Always make the root path to assets (image/videos..) a variable, store it in your global settings file, in both Javascript code and CSS

Because when the site goes live, those assets will come from a CDN and going in and changing all the paths the day before the site goes live is very annoying.

```less
@{ASSET_PATH}: 'images/'; // This variable will be changed by a script when pushing to production or other environments
.background {
    background: url('@{ASSET_PATH}/images/background.png')
}
```

```scss
$ASSET_PATH: 'images/'; // This variable will be changed by a script when pushing to production or other environments
.background {
    background: url('#{$ASSET_PATH}/images/background.png')
}
```

```javascript
var filePath = settings.ASSET_PATH + 'fancy/fancy-graphic.png';
```

## DEPLOYMENT

```bash
$ npm run release
```

## RUN TESTS

Use [Budo](http://npmjs.com/budo/) to develop and test your modules independently before integrating into the framework.

```bash
$ cd {{repoName}}
$ budo test/thingtotest/index.js [PORT] [-- browserify args]
```

## NPM MODULES

When installing modules be sure to use `npm install --save` for dependencies that will be used in the actual application deployed to the server.

And `npm install --save-dev` for modules that are only used on your system for workflow and development, like automated tasks etc.

[List of Jam3 Node modules](https://docs.google.com/a/jam3.com/spreadsheets/d/1bPImGwGLjqbOnBxMNmqGVz2mdfVb_R2FKaaoOw1IyP8/edit#gid=0)

# <%= projectName %>

<%= projectDescription %>

# Developers
<%= projectAuthorName %>

## PROJECT DOCUMENTATION


## GIT

```
git checkout <%= projectRepository %>
```

## Setup

```bash
$ npm install
<% if( useBower ) { %>$ bower install<%  } %>
```

BTSync
```bash
folder: /raw-assets/
key: [YOUR ASSET KEY]
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
$ grunt
```

## Development

Javascript Style Guide: https://github.com/Jam3/Javascript-Code-Conventions

### JS

All classes, for which you need to create an instance of, should be named using title case: (Sections are exempt from this rule)
- Home.js
- FancySpritesheetClass.js
- EpicAnimationElement.js

All modules that return just an object, should be named using camel case:
- settings.js
- numbersHelper.js
- emptyObject.js

Capitalize 'ID' and 'URL' in variable names
- linkID
- postURL
- menuItemID

### LESS

Use dashes to seperate words in css classes/ids, do NOT use camelCase:
- .big-pickle
- .large-img
- #funky-monkey

Nest your styles! So that we don't have weird class overrides

### IMAGES

Name images using dashes:
- large-pixel-image.png
- cute-yellow-pepper.png

### GLOBAL VARIABLES

Always make the root path to assets (image/videos..) a variable, store it in your global settings file, in both Javascript code and CSS

Because when the site goes live, those assets will come from a CDN and going in and changing all the paths the day before the site goes live is very annoying.

```css
@CDN: 'images/'; // This variable will be changed by a grunt script when pushing to production or other environments
.background {
    background: url('@{CDN}/background.png')
}
```

```javascript
var filePath = settings.CDN + 'fancy/fancy-graphic.png';
```

## DEPLOYMENT

```bash
$ grunt release
```

## RUN TESTS

Use [Beefy](http://didact.us/beefy/) to develop and test your modules independently before integrating into the framework.

```bash
$ cd <%= projectName %>
$ beefy test/thingtotest/index.js [PORT] [-- browserify args]
```

## NPM MODULES

When installing modules be sure to use `npm install --save` for dependencies that will be used in the actual application deployed to the server.

And `npm install --save-dev` for modules that are only used on your system for workflow and development, like automated grunts tasks etc.

[List of Jam3 Node modules](https://docs.google.com/a/jam3.com/spreadsheets/d/1bPImGwGLjqbOnBxMNmqGVz2mdfVb_R2FKaaoOw1IyP8/edit#gid=0)

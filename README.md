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

### Setup Favicons

#### Default setup
After generate the scalfolding you will have already setup the favicons for all the common devices, including those with iOS, Android, Windows Phone and for desktop version.

#### Customize them

You can change the default configuration modifying the file `/scripts/favicons/faviconDescription.json`. All the posible option are located in [http://realfavicongenerator.net/api/non_interactive_api](http://realfavicongenerator.net/api/non_interactive_api).

If you want to change the image you can replace the image located in `/scripts/favicons/favicon_template.png` for your new favicon image. The recomended size for this master image is `500x500`.

After change all the things you want just run `npm run update-favicons` and you will get your new favicons ready.

*Note:*
If you run the project on dev you won't see them because `budo` is creating an  own `index.html`. If you run `npm run release` you will see all this properly working.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/generator-jam3/blob/master/LICENSE.md) for details.

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
Default: (empty string)  
A name used in the README.md, package.json and humans.txt.

`What is your email? (Author Email)`  
Default: (empty string)  
An email used in the package.json and humans.txt.

`Describe the project:`  
Default: (empty string)  
A brief description of the project that is used at the top of the README.md.

`What is your git repository? (GitHub Repository)`  
Default: (empty string)  
The git repository used for the project, used within the package.json.

`What framework will your project use?"`  
Default: React  
The framework that this project will be based on, all necessary files and modules will be downloaded to get you up and running with the selected framework. Currently supports React, Bigwheel, or None. In the case of None, source files won't be created, but all the common development scripts will still be setup.

`Would you perfer ComponentName/ComponentName.js over ComponentName/index.js?`  
Default: false  
Whether file names will follow the convention of [folder name]/[folder name].js or [folder name]/index.js.

`Use push states?`  
Default: true  
Whether to use push states in the application, if false, uses hashbangs. This will setup the proper configuration in the framework and the .htaccess file.

`What css preprocessor will your project use?`  
Default: SCSS  
Which css preprocessor should be setup on the project, defaults to SASS, but LESS is also an option.

`Separate common npm modules into vendor.js?`  
Default: true  
Whether to separate all npm modules into a separate vender.js file, limiting the bundle.js file to just custom code.

`What backend language would you like to use?`  
Default: PHP  
Whether to copy over backend libraries that aid development such as automatic meta tag generation.

`Would you like to include an unsupported page?`  
Default: true  
Whether to include automatic unsupported page redirection.

`Choose the password to use for password protection. (leave blank to disable)`  
Default: (empty string)  
If you want to enable password protection via .htaccess, simply type the password you would like to use and the .htaccess and .htpasswd files will be created.

`Where on the server will your .htpasswd be located?`  
Default: /var/www  
If you opted to add password protection, this will need to be set to the location of the .htpasswd file in your production environment.

### [Generated Project Documentation](templates/base/README.md)

## License

MIT, see [LICENSE.md](http://github.com/Jam3/generator-jam3/blob/master/LICENSE.md) for details.

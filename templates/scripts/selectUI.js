'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var pathToUIDir = path.join(__dirname, '..', 'test');
var files = fs.readdirSync(pathToUIDir)
.filter(function(file) {
  var isNotHidden = file.charAt(0) !== '.';
  var isNotFolderWithoutIndex = true;
  var pathFile = path.join(pathToUIDir, file);

  if(isNotHidden && fs.statSync(pathFile).isDirectory()) {
    isNotFolderWithoutIndex = fs.existsSync(path.join(pathFile, 'index.js'));
  }

  return isNotHidden && isNotFolderWithoutIndex;
});

if(files.length > 1) {
  var prompt = inquirer.createPromptModule({
    output: process.stderr
  });

  prompt([
    { name: 'SCRIPT', type: 'rawlist', choices: files, message: 'Select a UI component you\'d like to test:' }
  ])
  .then(function(result) {
    result.SCRIPT = path.join(pathToUIDir, result.SCRIPT);

    console.log(JSON.stringify(result));
  });
} else if(files.length === 1) {
  console.log(JSON.stringify({
    SCRIPT: path.join(pathToUIDir, files[ 0 ])
  }));
}
'use strict';
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

function getTimestamp() {
  var str = new Date().toISOString().substring(0,19);
  return str.replace(/-/g,'').replace('T','-').replace(/:/g,'');
}

if (argv.delete) {
  fs.unlinkSync('timestamp.txt');
} else {
  fs.writeFileSync('timestamp.txt',getTimestamp());
}
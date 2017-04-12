'use strict';
var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var file = path.join(__dirname,'timestamp.txt');

function getTimestamp() {
  var str = new Date().toISOString().substring(0,19);
  return str.replace(/-/g,'').replace('T','-').replace(/:/g,'');
}

if (argv.delete) {
  if (fs.existsSync(file)) fs.unlinkSync(file);
} else {
  fs.writeFileSync(file,getTimestamp());
}

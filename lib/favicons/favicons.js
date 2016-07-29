var rfg = require('rfg-api').init();
var path = require('path');
var glob = require('glob');
var fs = require('fs');

var API_KEY = '402333a17311c9aa68257b9c5fc571276090ee56';

function Favicon(favDesc, favData, dir) {
  this.description = favDesc;
  this.data = favData;
  this.favOutput = dir;
}

Favicon.prototype.generate = function(onFinish){
  fs.readFile(this.description, onReadDescriptionFile.bind(this, onFinish));
}

Favicon.prototype.inject = function(filename) {
  fs.readFile(this.data, function(err, data){
    if (err) {
      throw err;
    }

    var content = JSON.parse(data).favicon.html_code;

    fs.readFile(filename, function(err, markups){
      if (err) {
        throw err;
      }

      rfg.injectFaviconMarkups(markups, content, null, function(err, finalContent) {
        fs.writeFile(filename, finalContent, function(err) {
          if (err) {
            throw err;
          }

          console.log('Favicons injection completed');
        })
      });
    });
  });
}

function onReadDescriptionFile(onFinish, err, desc) {
  if (err) {
    throw err;
  }

  var favicon = JSON.parse(desc);

  var opts = {
    apiKey: API_KEY,
    masterPicture: path.join(__dirname, favicon.masterPicture),
    iconsPath: favicon.iconsPath,
    design: favicon.design,
    settings: favicon.settings,
    versioning: favicon.versioning
  };

  var request = rfg.createRequest(opts);

  rfg.generateFavicon(request, this.favOutput, onGenerationComplete.bind(this, onFinish));
}

function onGenerationComplete(onFinish, err, result) {
  if (err) {
    throw err;
  }

  fs.writeFile(this.data, JSON.stringify(result), function(err) {
      if (err) {
        throw err;
      }

      console.log("Favicons generation completed");
      onFinish();
    });
}


module.exports = Favicon;
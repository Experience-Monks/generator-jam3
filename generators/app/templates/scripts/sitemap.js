var sm = require('sitemap');
var fs = require('fs');
var model = require('../lib/model');

var urls = [];

var folderDestination = 'release';

for(var index in model) {
  if(index.indexOf('/') == 0) {
    urls.push( { url: index, changefreq: 'weekly', priority: 0.5 } );
  }
}

// Creates a sitemap object given the input configuration with URLs
var sitemap = sm.createSitemap({
      hostname: 'http://example.com',
      urls: urls
    });

if (!fs.existsSync(folderDestination)){
    fs.mkdirSync(folderDestination);
}

// Gives you a string containing the XML data
var xml = sitemap.toString();

fs.writeFile(folderDestination + "/sitemap.xml", xml, function(err) {
    if(err) {
        return console.log("ERROR: sitemap.xml wasn't created.");
    }
    console.log("---------------------------------------------");
    console.log("The sitemap.xml file was created! Please review manually and setup proper change frecuency and priority.");
    console.log("---------------------------------------------");
});

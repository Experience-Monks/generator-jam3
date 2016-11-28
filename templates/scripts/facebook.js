var argv = require('minimist')(process.argv.slice(2));
var https = require('https');
function call(path,data,cb) {
  if (!cb && typeof data === 'function') {
    cb = data;
    data = undefined;
  }
  var req = https.request({
    host: 'graph.facebook.com',
    path: path,
    port: 443,
    method: data ? 'POST' : 'GET'
  }, function(res) {
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      if (cb) cb(data);
    });
  });
  if (data) req.write(data);
  req.end();
}

var share = {};
try {
 share = require('../static/json/share.json');
} catch(err) {}
if (!share) {
  try {
    share = require('../raw-assets/json/share.json');
  } catch(err) {}
}

if (argv.url) {
  if (argv.url.charAt(argv.url.length-1)==="/") {
    var url = encodeURIComponent(argv.url);
  } else {
    var url = encodeURIComponent(argv.url+"/");
  }
  call('/oauth/access_token?client_id=1818737171740817&client_secret=16f29763d87a3d597acf11920bd659b6&grant_type=client_credentials',function(data) {
    var token = data.replace('access_token=','');
    call('/','id='+url+'&scrape=true&access_token='+token,function(data) {
      console.log('\x1b[32m CLEARED:',decodeURIComponent(url),'\x1b[0m');
    });
    Object.keys(share).forEach(function(cur,i) {
      if (cur!='default') { 
        setTimeout(function() {
          call('/','id='+url+encodeURIComponent(cur)+'&scrape=true&access_token='+token,function(data) {
            console.log('\x1b[32m CLEARED:',decodeURIComponent(url)+cur,'\x1b[0m');
          });
        },(i+1)*500);
      }
    });
  });
} else {
  console.log('\x1b[31m Please provide a url in this format: npm run facebook -- --url=[YOUR URL]\x1b[0m');
}
'use strict';
var path = require('path');
var config = require('./config');
var budo = require('budo');
var style = require('./style');
var copy = require('./copy');
var fs = require('fs');

var useLiveClient = config.liveReloadClient;
var liveOpts = useLiveClient ? {
  // If we are making frequent changes to ./live.js
  // Then we should set this to false so we don't need to
  // re-start budo each time. :)
  cache: true,
  // This is only needed to debug our LiveReload client
  // e.g. as above, you may want this to true if you're changing it!
  debug: false,
  // Expose LiveReload client to window.require('budo-livereload')
  expose: true,
  // Additional script(s) to include after the LiveReload client
  include: require.resolve('./live.js')
} : undefined;

var wss;
var b = budo(config.entry, {
  serve: config.bundle,
  open: true,
  dir: config.output,
  stream: process.stdout,
  pushstate: true
});
b.live(liveOpts);
b.watch(['**/*.{html,css,less,scss}',config.raw+'**/*.*']);
b.on('connect', function (ev) {
  if (useLiveClient) wss = ev.webSocketServer;
});
b.on('watch',function(e,file) {
  var ext = path.extname(file);
  if (file.indexOf(path.basename(config.raw))>-1) {
    copy(file);
  } else if (file.indexOf('.less')>-1 || file.indexOf('.scss')>-1) {
    style(function(err) {
      if (err) {
        sendClientPopup(err);
      }
    });
  } else if (ext && /\.(css|html?)$/i.test(ext)) {
    b.reload(file);
  }
});
b.on('pending', function() {
  b.reload();
});

function sendClientPopup (data) {
  if (!wss || !useLiveClient) return;
  var message = JSON.stringify(data);
  wss.clients.forEach(function (socket) {
    socket.send(message);
  });
}

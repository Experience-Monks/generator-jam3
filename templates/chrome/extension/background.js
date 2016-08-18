const bluebird = require('bluebird');
global.Promise = bluebird;

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise(resolve => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

promisifyAll(chrome, [
  'windows',
  'browserAction',
  'tabs',
]);
promisifyAll(chrome.storage, [
  'local',
]);

require('./background/inject');
require('./background/badge');

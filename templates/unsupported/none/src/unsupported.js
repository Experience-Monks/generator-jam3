import matrix from '../static/device-matrix.json';
import detect from './util/detect';

let version = parseFloat(detect.browserVersion);
let osVersion = parseFloat(detect.osVersion);
let browser = (detect.isIE) ? 'internet explorer' : detect.browser;
let os = detect.os;
let platforms = ['ios', 'android'];

let unsupported = false;
let warning = false;

for (let key in matrix['unsupported']) {
  key = key.toLocaleLowerCase();
  if (platforms.indexOf(key) > -1) {
    if (os === key && osVersion <= matrix['unsupported'][key]) unsupported = true;
  } else {
    if (browser === key && version <= matrix['unsupported'][key]) unsupported = true;
  }
}
for (let key in matrix['warning']) {
  key = key.toLocaleLowerCase();
  if (platforms.indexOf(key) > -1) {
    if (os === key && osVersion <= matrix['warning'][key]) warning = true;
  } else {
    if (browser === key && version <= matrix['warning'][key]) warning = true;
  }
}
if (unsupported && !detect.isBot) {
  window.location = 'unsupported.html';
} else if (warning) {
  window._browserWarning = true;
}

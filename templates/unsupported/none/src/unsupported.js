import matrix from '../static/device-matrix.json';
import detect from './util/detect/';
let unsupported = false;
let warning = false;
let browser = detect.browser.toLocaleLowerCase();
if (browser == 'ie') browser = 'internet explorer';
let version = parseFloat(detect.browserVersion);
let os = (detect.os || '').toLocaleLowerCase();
let osVersion = detect.osVersion === 'Unknown' ? Number.MAX_SAFE_INTEGER || 9999 : parseFloat(detect.osVersion);
let platforms = ['ios', 'android'];
for (var key in matrix['unsupported']) {
  key = key.toLocaleLowerCase();
  if (platforms.indexOf(key)>-1) {
    if (os === key && osVersion <= matrix['unsupported'][key]) unsupported = true;
  } else {
    if (browser === key && version <= matrix['unsupported'][key]) unsupported = true;
  }
}
for (var key in matrix['warning']) {
  key = key.toLocaleLowerCase();
  if (platforms.indexOf(key)>-1) {
    if (os === key && osVersion <= matrix['warning'][key]) warning = true;
  } else {
    if (browser === key && version <= matrix['warning'][key]) warning = true;
  }
}
if (unsupported) {
  window.location = 'unsupported.html';
} else if (warning) {
  window._browserWarning = true;
}

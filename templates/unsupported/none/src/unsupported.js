import matrix from '../static/device-matrix.json';
import device from './util/detect/util-os';
import browser from './util/detect/util-browser.js';
let supported = false;
let version = parseFloat(browser.checkVersion());
let os = device.os().toLocaleLowerCase();
let osVersion = parseFloat(device.osVersion());
if (os) os = os.toLowerCase();
if (osVersion==='Unknown') osVersion = Number.MAX_SAFE_INTEGER || 9999;
if (browser.checkBot()) {
  supported = true;
} else if (os === 'android' || os === 'ios') {
  if (os==='ios' && (browser.checkSafari() || browser.checkFacebook()) && osVersion>=matrix.ios) supported = true;
  if (os==='android' && (browser.checkChrome() || browser.checkFacebook()) && osVersion>=matrix.android && version>=matrix.chrome) supported = true;
} else if (browser.checkIE() && version>=matrix.ie ||
    browser.checkFirefox() && version>=matrix.firefox ||
    browser.checkChrome() && version>=matrix.chrome ||
    browser.checkSafari() && version>=matrix.safari ||
    browser.checkEdge() ) {
  supported = true;
}
if (!supported) window.location = 'unsupported.html';

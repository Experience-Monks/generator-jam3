import matrix from '../static/device-matrix.json';
import detect from './util/detect';

let supported = false;
let version = parseFloat(detect.browserVersion);
let osVersion = parseFloat(detect.osVersion);

if (detect.isBot) {
  supported = true;
} else if (detect.os === 'android' || detect.os === 'ios') {
  if (detect.os === 'ios' && (detect.isSafari || detect.isFacebook) && osVersion >= matrix.ios) supported = true;
  if (detect.os === 'android' && (detect.isChrome || detect.isFacebook) && osVersion >= matrix.android && version >= matrix.chrome) supported = true;
} else if (detect.isIE && version >= matrix.ie ||
  detect.isFirefox && version >= matrix.firefox ||
  detect.isChrome && version >= matrix.chrome ||
  detect.isSafari && version >= matrix.safari ||
  detect.isEdge) {
  supported = true;
}
if (!supported) window.location = 'unsupported.html';

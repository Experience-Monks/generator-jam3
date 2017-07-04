const ua = navigator.userAgent.toLowerCase();
const appVersion = navigator.appVersion.toLowerCase();
const vendor = (navigator.vendor) ? navigator.vendor.toLowerCase() : '';
const bots = ['facebookexternalhit', 'linkedinbot', 'google (+https://developers.google.com/+/web/snippet/)', 'facebot', 'https://developers.google.com/+/web/snippet/', 'twitterbot', 'tumblr', 'googlebot'];

/**
 * This function will return whether this UtilBrowser we're running on is Internet Explorer.
 *
 * @method checkIE
 * @return {Boolean} If this function returns true we're running on Internet Explorer, false if not.
 */
module.exports.checkIE = function() {
  const msie = ua.indexOf('msie') >= 0;
  const trident = ua.indexOf('trident/') >= 0;
  return (msie || trident);
};

/**
 * This function will return whether this UtilBrowser we're running on is a crawler bot.
 *
 * @method checkBot
 * @return {Boolean} If this function returns true we're running on a crawler bot, false if not.
 */
module.exports.checkBot = function() {
  const uaLower = ua.toLowerCase();
  let isBot = false;
  bots.map(function(cur) {
    if (uaLower.indexOf(cur) > -1) isBot = true;
  });
  return isBot;
};

/**
 * This function will return whether this UtilBrowser we're running on is the facebook in app browser.
 *
 * @method checkFacebook
 * @return {Boolean} If this function returns true we're running on the facebook in app browser, false if not.
 */
const checkFacebook = function() {
  return (ua.indexOf('fban') > -1) || (ua.indexOf('fbav') > -1);
};
module.exports.checkFacebook = checkFacebook;

/**
 * This function will return whether this UtilBrowser we're running on is Firefox.
 *
 * @method checkFirefox
 * @return {Boolean} If this function returns true we're running on Firefox, false if not.
 */
module.exports.checkFirefox = function() {
  return ua.indexOf('firefox') >= 0;
};

/**
 * This function will return whether this UtilBrowser we're running on is Safari.
 *
 * @method checkSafari
 * @return {Boolean} If this function returns true we're running on Safari, false if not.
 */
module.exports.checkSafari = function() {
  return (ua.indexOf('safari') >= 0 && vendor.indexOf('apple') >= 0);
};

/**
 * This function will return whether this UtilBrowser we're running on is Chrome.
 *
 * @method checkChrome
 * @return {Boolean} If this function returns true we're running on Chrome, false if not.
 */
module.exports.checkChrome = function() {
  return (ua.indexOf('chrome') >= 0 && vendor.indexOf('google') >= 0)
};

/**
 * This function will return whether this computer we're running on is Windows.
 *
 * @method checkWindows
 * @return {Boolean} If this function returns true we're running on Windows, false if not.
 */
module.exports.checkWindows = function() {
  return appVersion.indexOf('win') >= 0;
};

/**
 * This function will return whether this computer we're running on is Mac.
 *
 * @method checkMac
 * @return {Boolean} If this function returns true we're running on Mac, false if not.
 */
module.exports.checkMac = function() {
  return appVersion.indexOf('mac os x') >= 0;
};

/**
 * This function will return the version number of the browser we are using.
 *
 * @method checkVersion
 * @return {Number} The version number of the browser.
 */
module.exports.checkVersion = function() {
  // http://stackoverflow.com/questions/5916900/detect-version-of-browser
  let tem;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return (tem[1] || '');
  }
  if (M[1] === 'chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem !== null) {
      return tem[1];
    }
  }
  // Facebook in-app browser
  if (checkFacebook()) {
    // Apple, There is not version, taken from the OS
    const FBApp = ua.match(/(fbsv)\/?\s*(\d+)/i);
    if (FBApp && FBApp[1] === 'fbsv') {
      return FBApp[2];
    }

    //Android, Take the chrome version
    if (M[1] === 'chrome') {
      return M[2];
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
    M.splice(1, 1, tem[1]);
  }
  return M[1];
};

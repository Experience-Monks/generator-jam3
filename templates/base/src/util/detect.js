import browser from 'bowser';
import MobileDetect from 'mobile-detect';

const ua = navigator.userAgent.toLowerCase();
const md = new MobileDetect(ua);
const bots = ['facebookexternalhit', 'linkedinbot', 'google (+https://developers.google.com/+/web/snippet/)', 'facebot', 'https://developers.google.com/+/web/snippet/', 'twitterbot', 'tumblr', 'googlebot'];

function checkBot() {
  let isBot = false;
  bots.map(function(cur) {
    if (ua.toLowerCase().indexOf(cur) > -1) isBot = true;
  });
  return isBot;
}

function checkFacebook() {
  return (ua.indexOf('fban') > -1) || (ua.indexOf('fbav') > -1);
}

function checkTwitter() {
  return (ua.indexOf('twitter') > -1);
}

function checkInstagram() {
  return (ua.indexOf('instagram') > -1);
}

function checkPinterest() {
  return (ua.indexOf('pinterest') > -1);
}

function checkInAppBrowser() {
  return checkFacebook() || checkTwitter() || checkInstagram() || checkPinterest();
}

function checkInAppBrowserVersion() {
  // take iOS version for Apple
  if (browser.ios) {
    const OSApp = ua.match(/OS \s*(\d+)/i);
    return OSApp[1];
  }

  // take Chrome version for Android
  const FBApp = ua.match(/(chrome)\/?\s*(\d+)/i);
  if (FBApp && FBApp[1] === 'chrome') {
    return FBApp[2];
  }

  return 9999;
}

function checkOS() {
  if (browser.mac) return 'mac';
  if (browser.windows) return 'windows';
  if (browser.windowsphone) return 'windowsphone';
  if (browser.linux) return 'linux';
  if (browser.chromeos) return 'chromeos';
  if (browser.android) return 'android';
  if (browser.ios) return 'ios';
  if (browser.blackberry) return 'blackberry';
  if (browser.firefoxos) return 'firefoxos';
}

const checkDevice = function() {
  let device;
  if (browser.mobile) {
    device = 'phone';
  } else if (browser.tablet) {
    device = 'tablet';
  } else {
    device = 'desktop';
  }
  return device;
};

const checkVendor = function() {
  return (navigator.vendor) ? navigator.vendor.toLowerCase() : '';
};

const checkDevicePixelRatio = function() {
  return window.devicePixelRatio;
};

const checkManufacturer = function() {
  let man = 'unknown';
  if (md.phone()) {
    man = md.phone();
  } else if (md.tablet()) {
    man = md.tablet();
  }
  return man.toLowerCase();
};

const getClasses = function() {
  const classes = [
    browser.mobile || browser.tablet ? 'mobile' : '',
    checkDevice(),
    'x' + checkDevicePixelRatio(),
    browser.name.toLocaleLowerCase(),
    'v' + browser.version,
  ];
  if (md.mobile()) classes.push(checkManufacturer());
  return classes.filter(cur => Boolean(cur));
};

module.exports = {
  isBot: checkBot(),
  isFacebook: checkFacebook(),
  isTwitter: checkTwitter(),
  isInstagram: checkInstagram(),
  isPinterest: checkPinterest(),
  isInAppBrowser: checkInAppBrowser(),
  inAppBrowserVersion: checkInAppBrowserVersion(),
  device: checkDevice(),
  vendor: checkVendor(),
  os: checkOS(),
  osVersion: browser.osversion,
  browser: browser.name.toLocaleLowerCase(),
  browserVersion: browser.version,
  devicePixelRatio: checkDevicePixelRatio(),
  classes: getClasses(),
  isMobile: browser.mobile || browser.tablet,
  isPhone: browser.mobile,
  isTablet: browser.tablet,
  isDesktop: !browser.mobile,
  isChrome: browser.chrome,
  isIE: browser.msie,
  isEdge: browser.msedge,
  isFirefox: browser.firefox,
  isSafari: browser.safari,
  isOpera: browser.opera,
  md: md,
  bowser: browser,
  get orientation() {
    if (window.screen) {
      const orientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation;
      if (orientation && orientation.type) {
        return orientation.type.split('-', 1)[0];
      }
    }
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (w < h) {
      return 'portrait';
    } else {
      return 'landscape';
    }
  }
};

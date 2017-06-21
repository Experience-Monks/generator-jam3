'use strict';
import MobileDetect from 'mobile-detect';
import utilOS from './util-os';
import utilBrowser from './util-browser';

const ua = navigator.userAgent;
const md = new MobileDetect(ua);
const env = process.env.NODE_ENV || 'development';

const checkDevice = function() {
  let device = 'desktop';
  if (md.mobile() && md.phone()) {
    device = 'phone';
  } else if (md.mobile() && md.tablet()) {
    device = 'tablet';
  }
  return device;
};

const checkVendor = function() {
  return (navigator.vendor) ? navigator.vendor.toLowerCase() : '';
};

const checkBrowser = function() {
  let browser = 'unknown';
  const uaLower = ua.toLowerCase();
  const msie = uaLower.indexOf('msie') >= 0;
  const trident = uaLower.indexOf('trident/') >= 0;

  if (msie || trident) {
    browser = 'ie';
  } else if (ua.toLowerCase().indexOf('edge') >= 0) {
    browser = 'edge';
  } else if (uaLower.indexOf('firefox') >= 0) {
    browser = 'firefox';
  } else if ((uaLower.indexOf('safari') >= 0 && checkVendor().indexOf('apple') >= 0) || (env.indexOf('dev') >= 0 && uaLower.indexOf('iphone') >= 0 && uaLower.indexOf('chrome') < 0)) {
    browser = 'safari';
  } else if (uaLower.indexOf('opr') >= 0) {
    browser = 'opera';
  } else if (uaLower.indexOf('chrome') >= 0 && checkVendor().indexOf('google') >= 0) {
    browser = 'chrome';
  }
  return browser;
};

const checkDevicePixelRatio = function() {
  let pxlRatio = window.devicePixelRatio;
  if (utilOS.os() === 'iOS' && window.innerWidth >= 375 && window.devicePixelRatio < 3) pxlRatio = 3;
  return pxlRatio;
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
  const classes = [checkDevice(), 'x' + checkDevicePixelRatio(), checkBrowser(), 'v' + utilBrowser.checkVersion(), (utilOS.os()).replace(/\s/g, '_').toLocaleLowerCase()];
  if (md.mobile()) classes.push(checkManufacturer());
  return classes.filter(function(cur) {
    return !!cur;
  });
};

module.exports = {
  isBot: utilBrowser.checkBot(),
  isFacebook: utilBrowser.checkFacebook(),
  device: checkDevice(),
  vendor: checkVendor(),
  os: utilOS.os(),
  osVersion: utilOS.osVersion(),
  browser: checkBrowser(),
  browserVersion: utilBrowser.checkVersion(),
  manufacturer: checkManufacturer(),
  devicePixelRatio: checkDevicePixelRatio(),
  classes: getClasses(),
  isMobile: !!md.mobile(),
  isPhone: !!md.phone(),
  isTablet: !!md.tablet(),
  isDesktop: !(md.phone() || md.tablet()),
  isChrome: (checkBrowser().indexOf('chrome') >= 0 && checkVendor().indexOf('google') >= 0),
  isIE: ((ua.toLowerCase().indexOf('msie') >= 0) || (ua.toLowerCase().indexOf('trident/') >= 0)),
  isEdge: (ua.toLowerCase().indexOf('edge') >= 0),
  isFirefox: (checkBrowser().indexOf('firefox') >= 0),
  isSafari: (checkBrowser().indexOf('safari') >= 0 && checkVendor().indexOf('apple') >= 0),
  isOpera: (checkBrowser().indexOf('opera') >= 0),
  md: md,
  get orientation() {
    if (window.screen) {
      const orientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation;
      if (orientation && orientation.type) {
        return orientation.type.split('-', 1)[0];
      }
    }
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const aspectRatio = w / h;
    if (aspectRatio < 1) {
      return 'portrait'
    } else {
      return 'landscape'
    }
  }
};

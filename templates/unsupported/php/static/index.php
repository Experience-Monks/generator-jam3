<?php
require('lib/Browser.php');

$browser = new Browser();
$devices = json_decode(file_get_contents('device-matrix.json'), true);
$lookup = array(
  'ie' => Browser::BROWSER_IE,
  'safari' => Browser::BROWSER_SAFARI,
  'chrome' => Browser::BROWSER_CHROME,
  'firefox' => Browser::BROWSER_FIREFOX,
  'opera' => Browser::BROWSER_OPERA,
  'ios' => array(Browser::PLATFORM_IPHONE, Browser::PLATFORM_IPAD),
  'android' => Browser::PLATFORM_ANDROID
);


if (
  $browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() < $devices['ie']
  || $browser->getBrowser() == Browser::BROWSER_SAFARI && $browser->getVersion() < $devices['safari']
  || $browser->getBrowser() == Browser::BROWSER_CHROME && $browser->getVersion() < $devices['chrome']
  || $browser->getBrowser() == Browser::BROWSER_FIREFOX && $browser->getVersion() < $devices['firefox']
  || ($browser->getBrowser() == Browser::BROWSER_IPHONE || $browser->getBrowser() == Browser::BROWSER_IPAD) && $browser->getVersion() < $devices['safari']
  ) {
    header('Location: ' . 'unsupported.html');
} else {
  require('main.php');
}
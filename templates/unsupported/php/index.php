<?php
require('lib/Browser.php');
require('lib/Mobile_Detect.php');

$browser = new Browser();
$devices = json_decode(file_get_contents('device-matrix.json'), true);

if (
  $browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() < $devices['ie']
  || $browser->getBrowser() == Browser::BROWSER_SAFARI && $browser->getVersion() < $devices['safari']
  || $browser->getBrowser() == Browser::BROWSER_CHROME && $browser->getVersion() < $devices['chrome']
  || $browser->getBrowser() == Browser::BROWSER_FIREFOX && $browser->getVersion() < $devices['firefox']
  || ($browser->getBrowser() == Browser::BROWSER_IPHONE || $browser->getBrowser() == Browser::BROWSER_IPAD) && $browser->getVersion() < $devices['safari']
  ) {
    header('Location: ' . 'unsupported.html');
} else {
  require('index.html');
}
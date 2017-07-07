<?php

function checkUnsupported($device, $version, $detect) {
  $device = strtolower($device);
  $platforms = array('ios', 'android');
  if (in_array($device, $platforms)) {
    return strtolower($detect->os->name) == $device && $detect->os->version->is('<=', $version);
  } else {
    return strtolower($detect->browser->name) == $device && $detect->browser->version->is('<=', $version);
  } 
}

require('lib/whichbrowser.phar');
// https://github.com/WhichBrowser/Parser Updated: July 4th, 2017
$detect = new WhichBrowser\Parser(isset($_SERVER['HTTP_USER_AGENT']) ? htmlspecialchars($_SERVER['HTTP_USER_AGENT'], ENT_QUOTES) : "");
$devices = json_decode(file_get_contents('device-matrix.json'), true);

$unsupported = false;
$warning = false;
foreach ($devices['unsupported'] as $key => $value) {
  if (checkUnsupported($key, $value, $detect)) $unsupported = true;
}
foreach ($devices['warning'] as $key => $value) {
  if (checkUnsupported($key, $value, $detect)) $warning = true; 
}

if ($unsupported) {
  header('Location: ' . 'unsupported.html');
} else {
  require('main.php');
}
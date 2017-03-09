<?php

class Meta {

  var $url;
  var $host;
  var $path;
  var $ua;
  var $uaList = array('facebookexternalhit','linkedinbot','google (+https://developers.google.com/+/web/snippet/)','facebot','https://developers.google.com/+/web/snippet/','twitterbot','tumblr');
  var $tags = array(
    'title' => '',
    'description' => '',
    'keywords' => '',
    'og:title' => '',
    'og:type' => 'website',
    'og:image' => '',
    'og:url' => '',
    'og:description' => '',
    'og:site_name' => '',
    'twitter:card' => 'summary_large_image',
    'twitter:title' => '',
    'twitter:image' => '',
    'twitter:description' => '',
    'twitter:site' => '',
    'twitter:creator' => ''
  );
  var $nonMeta = array(
    'title'
  );

  function Meta($json=NULL,$path=NULL) {
    $this->ua = strtolower($_SERVER['HTTP_USER_AGENT']);
    if (array_key_exists('HTTP_X_FORWARDED_PROTO',$_SERVER)) {
      $protocol = $_SERVER['HTTP_X_FORWARDED_PROTO'];
    } else {
      $protocol = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? 'https' : 'http' );
    }
    $this->host = $protocol.'://'.$_SERVER['HTTP_HOST'];
    $this->path = is_string($path) ? $path : $_SERVER['REQUEST_URI'];
    $this->url = $this->host.$this->path;
    $this->addTag('og:url',$this->url);

    if (!empty($json)) {
      $this->share = json_decode(file_get_contents($json),true);
      $this->setPath($this->path);
    }
  }

  function isBot() {
    $isBot = false;
    for ($i=0; $i<count($this->uaList); $i++) {
      if (strpos($this->ua,$this->uaList[$i])!==false) $isBot = true;
    }
    return $isBot;
  }

  function setPath($path) {
    $this->path = $path;
    $data = $this->share["default"];
    if (@$share[$path]) $data = array_merge($data, $this->share[$path]);
    $this->addTags($data);
  }

  function addTag($tag, $content) {
    $this->tags[$tag] = $content;
    if ($tag==='title' || $tag==='description' || $tag==='image') {
      $this->tags['twitter:'.$tag] = $content;
      $this->tags['og:'.$tag] = $content;
    }
  }

  function addTags($data) {
    foreach ($data as $key => $value) {
      $this->addTag($key,$value);
    }
  }

  function write() {
    foreach ($this->tags as $key => $value) {
      if (in_array($key,$this->nonMeta)) {
        echo '<'.$key.'>'.$value.'</'.$key.'>';
      } else {
        $type = (strpos($key,'og:')!==false) ? 'property' : 'name';
        echo '<meta '.$type.'="'.$key.'" content="'.$value.'"/>';
      }
    }
  }

}

?>

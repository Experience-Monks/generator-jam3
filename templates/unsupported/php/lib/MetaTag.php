<?php

class MetaTags {

    var $url;
    var $host;
    var $tags = array(
        'title' => '',
        'description' => '',
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

    function Meta() {
        $this->host = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? 'https' : 'http' ).'://'.$_SERVER['HTTP_HOST'];
        $this->url = $this->host.$_SERVER['REQUEST_URI'];
        $this->addTag('og:url',$this->url);
    }

    function addTag($tag,$content) {
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

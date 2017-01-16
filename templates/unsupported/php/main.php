<!doctype html>
<html>
<head>
  <?php
    require('./lib/Meta.php');
    $meta = new Meta('share.json');
    $meta->write();
  ?>
  <meta charset="utf-8">
  {{#if pushState}}<base href="/">{{/if}}
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no">
  <link rel="stylesheet" type="text/css" href="\{{stylesheet}}">
</head>
  <body>\{{#is NODE_ENV "production"}}\{{#if vendor}}
  <script type="text/javascript" src="\{{vendor}}"></script>\{{/if}}\{{/is}}
  <script type="text/javascript" src="\{{bundle}}"></script>
  </body>
</html>


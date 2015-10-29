'use strict';
module.exports = {
  settings: {
    'UA': '',
    'ASSET_PATH': process.env.ASSET_PATH,
    'ENVIRONMENT': process.env.ENVIRONMENT
  }<% data.forEach(function(cur) { %>,
  '<%=cur%>': {}<% }); %>
};

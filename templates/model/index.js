'use strict';
module.exports = {
  settings: {
    'UA': '',
    'PATH': process.env.PATH,
    'ENVIRONMENT': process.env.ENVIRONMENT
  }<% data.forEach(function(cur) { %>,
  '<%=cur%>': {}<% }); %>
};

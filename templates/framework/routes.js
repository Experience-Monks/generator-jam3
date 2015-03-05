module.exports = {
<%
  routes.forEach( function( route, idx, arr ) {

    var section = sectionFromRoute( route );

%>  '<%= route %>': require( '../sections/<%= section %>/' )<%= idx < arr.length - 1 ? ',' : '' %>
<% });
%>};

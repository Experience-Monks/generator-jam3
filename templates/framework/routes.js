'use strict';
module.exports = {
<%
	routes.forEach( function( route, idx, arr ) {

		var section = sectionFromRoute( route );

%>	'<%= route %>': require( '../sections/<%= section %>/<%= ((changeFileNaming) ? section + ".js" : "index.js") %>')<%= idx < arr.length - 1 ? ',' : '' %>
<% });
%>};

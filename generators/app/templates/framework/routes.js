module.exports = {
<% routes.forEach( function( route ) {
	%><%= route %>: require( '../sections/Landing' )
<% });
%>};
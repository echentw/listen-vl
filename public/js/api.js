var API_KEY = 'YOUR API KEY';

$(document).ready(function() {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

var googleApiClientReady = function() {
  gapi.client.setApiKey(API_KEY);
  gapi.client.load('youtube', 'v3');
  $('#search-button').attr('disabled', false);
};

var API_KEY = 'YOUR API KEY';

var player;
function onYouTubeIframeAPIReady() {
  var videoId = getUrlParameter('videoId');
  if (!videoId) {
    videoId = 'cO_U-jcvQT8';
  }

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady
    }
  });
}

var onPlayerReady = function(event) {
  $('#message').html('Ready!');
}

$(document).ready(function() {
  $('#play-video').click(function() {
    player.playVideo();
  });
  $('#stop-video').click(function() {
    player.stopVideo();
  });
  $('#pause-video').click(function() {
    player.pauseVideo();
  });
});

// Load the youtube search API
var googleApiClientReady = function() {
  gapi.client.setApiKey(API_KEY);
  gapi.client.load('youtube', 'v3');
  $('#search-button').attr('disabled', false);
};

$(document).ready(function() {
  var search = function() {
    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      maxResults: 10
    });

    request.execute(function(response) {
      $('#search-results').empty();

      for (var i = 0; i < response.result.items.length; ++i) {
        var item = response.result.items[i];
        var videoId = item.id.videoId;
        var title = item.snippet.title;

        var link = 'http://localhost:3000?videoId=' + videoId;

        $('#search-results').append('<a href="' + link + '" class="video-link" id="' + videoId + '">' + title + '</a><br>');
      }

      $('a').click(function(e) {
        console.log(e.target.id);
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: e.target.id,
          events: {
            'onReady': onPlayerReady
          }
        });
      });
    });
  };

  $('#search-button').click(function() {
    search();
  });
});

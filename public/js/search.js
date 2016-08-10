var API_KEY = 'YOUR API KEY';

var player;
var loop = false;
var onYouTubeIframeAPIReady = function() {
  var videoId = getUrlParameter('videoId');
  if (!videoId) {
    videoId = 'cO_U-jcvQT8';
  }

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

var onPlayerStateChange = function(event) {
  // if the player is stopped and it's in loop mode, then play again
  if (player.getPlayerState() == 0) {
    if (loop) {
      player.stopVideo();
      player.playVideo();
    } else {
      player.stopVideo();
      $('#play-status').text('stopped');
    }
  }
};

var onPlayerReady = function(event) {
  $('#video-title').text('Title: ' + player.getVideoData().title);
};

$(document).ready(function() {
  $('#play-status').text('stopped');
  $('#loop-status').text('not looping');

  $('#play-video').click(function() {
    player.playVideo();
    $('#play-status').text('playing');
  });
  $('#stop-video').click(function() {
    player.stopVideo();
    $('#play-status').text('stopped');
  });
  $('#pause-video').click(function() {
    player.pauseVideo();
    $('#play-status').text('paused');
  });
  $('#loop-video').click(function() {
    loop = !loop;
    if (loop) {
      $('#loop-status').text('looping');
    } else {
      $('#loop-status').text('not looping');
    }
  });
  $('#progress-bar').change(function() {
    var duration = player.getDuration();
    var progress = this.value;
    var seconds = Math.floor(duration * progress / 100);
    player.seekTo(seconds);
  });

  setInterval(function() {
    var currentTime = player.getCurrentTime();
    var duration = player.getDuration();
    $('#current-time').text(Math.floor(currentTime));
    $('#duration').text(Math.floor(duration));

    var progress = Math.floor(currentTime / duration * 100);
    $('#progress-bar').val(String(progress));
  }, 1000);
});

// Load the youtube search API
var googleApiClientReady = function() {
  gapi.client.setApiKey(API_KEY);
  gapi.client.load('youtube', 'v3');
  $('#search-button').attr('disabled', false);
};

$(document).ready(function() {
  var search = function() {
    var query = $('#query').val();
    var request = gapi.client.youtube.search.list({
      q: query,
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

        $('#search-results').append(
          '<a href="' + link + '" class="video-link" id="' + videoId + '">' + title + '</a><br>'
        );
      }

      $('a').click(function(e) {
        console.log(e.target.id);
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: e.target.id,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      });
    });
  };

  $('#search-button').click(function() {
    search();
  });
});

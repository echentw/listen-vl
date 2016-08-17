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
      $('#play-pause-video-btn').text('Play');
    }
  }
};

var onPlayerReady = function(event) {
  $('#video-title').text('Title: ' + player.getVideoData().title);
  player.setVolume(100);
};

$(document).ready(function() {
  $('#play-pause-video-btn').text('Play');
  $('#play-status').text('stopped');
  $('#loop-status').text('not looping');

  $('#show-video-btn').click(function() {
    var $container = $('.video-container')
    if ($container.is(':visible')) {
      $container.hide();
      $('#show-video-btn').text('Show Video');
    } else {
      $container.show();
      $('#show-video-btn').text('Hide Video');
    }
  });
  $('#play-pause-video-btn').click(function() {
    // -1: unstarted
    //  0: ended
    //  1: playing
    //  2: paused
    //  3: buffering
    //  5: video cued
    var state = player.getPlayerState();
    if (state == -1 || state == 2 || state == 5) {
      player.playVideo();
      $('#play-status').text('playing');
      $('#play-pause-video-btn').text('Pause');
    } else if (state == 1 || state == 3) {
      player.pauseVideo();
      $('#play-status').text('paused');
      $('#play-pause-video-btn').text('Play');
    }
  });
  $('#loop-btn').click(function() {
    loop = !loop;
    if (loop) {
      $('#loop-status').text('looping');
    } else {
      $('#loop-status').text('not looping');
    }
  });
  $('#progress-bar').on('input', function() {
    var duration = player.getDuration();
    var progress = this.value;
    var seconds = Math.floor(duration * progress / 100);
    player.seekTo(seconds);
  });
  $('#volume-bar').on('input', function() {
    player.setVolume(this.value);
  });

  setInterval(function() {
    var currentTime = player.getCurrentTime();
    $('#current-time').text(Math.floor(currentTime));

    var duration = player.getDuration();
    if (duration > 0) {
      $('#duration').text(Math.floor(duration));
      var progress = Math.floor(currentTime / duration * 100);
      $('#progress-bar').val(String(progress));
    } else {
      $('#progress-bar').val('0');
    }
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
      maxResults: 15
    });

    request.execute(function(response) {
      $('#search-results').empty();

      for (var i = 0; i < response.result.items.length; ++i) {
        var item = response.result.items[i];
        var title = item.snippet.title;

        if (item.id.videoId) {
          var videoId = item.id.videoId;
          var link = '/?videoId=' + videoId;
          $('#search-results').append(
            '<div class="search-result">' +
              '<span class="result-label">Video:</span>' +
              '<a href="' + link + '" class="video-link" id="' + videoId + '">' + title + '</a><br>' +
            '</div>'
          );
        } else if (item.id.playlistId) {
          var playlistId = item.id.playlistId;
          $('#search-results').append(
            '<div class="search-result">' +
              '<span class="result-label">Playlist:</span>' +
              '<span>' + title + '</span><br>' +
            '</div>'
          );
        }
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
  $('#query').on('keydown', function(e) {
    if (e.which == 13) {
      search();
    }
  });
});

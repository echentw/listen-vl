var PLAYER_HEIGHT = '390px';
var PLAYER_WIDTH = '640px';

var LOOPING = false;

var player;
var onYouTubeIframeAPIReady = function() {
  var videoId = getUrlParameter('id');
  if (!videoId) {
    videoId = 'moSFlvxnbgk';
  }
  player = new YT.Player('player', {
    height: PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
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
    if (LOOPING) {
      player.seekTo(0);
      player.playVideo();
    } else {
      player.stopVideo();
      $('#play-pause-btn').removeClass('fa-pause-circle');
      $('#play-pause-btn').addClass('fa-play-circle');
    }
  }
};

var onPlayerReady = function(event) {
  $('#video-title').text(player.getVideoData().title);
  player.setVolume(100);
};

$(document).ready(function() {
  $('#show-video-btn').click(function() {
    var $container = $('.video-container')

    if ($container.css('visibility') === 'hidden') {
      $container.css('height', PLAYER_HEIGHT);
      setTimeout(function() {
        $container.css('visibility', 'visible');
        $('#show-video-message').text('Hide Video');
      }, 500);
    } else {
      $container.css('visibility', 'hidden');
      $container.css('height', '0px');
      $('#show-video-message').text('Show Video');
    }
  });
  $('#play-pause-btn').click(function() {
    // -1: unstarted
    //  0: ended
    //  1: playing
    //  2: paused
    //  3: buffering
    //  5: video cued
    var state = player.getPlayerState();
    if (state == -1 || state == 2 || state == 5) {
      player.playVideo();
      $('#play-pause-btn').removeClass('fa-play-circle');
      $('#play-pause-btn').addClass('fa-pause-circle');
    } else if (state == 1 || state == 3) {
      player.pauseVideo();
      $('#play-pause-btn').removeClass('fa-pause-circle');
      $('#play-pause-btn').addClass('fa-play-circle');
    }
  });
  $('#loop-btn').click(function() {
    LOOPING = !LOOPING;
    if (LOOPING) {
      $('#loop-indicator').css('visibility', 'visible');
    } else {
      $('#loop-indicator').css('visibility', 'hidden');
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
    $('#volume-icon').removeClass('fa-volume-up');
    $('#volume-icon').removeClass('fa-volume-down');
    $('#volume-icon').removeClass('fa-volume-off');
    if (this.value == 0) {
      $('#volume-icon').addClass('fa-volume-off');
    } else if (this.value < 50) {
      $('#volume-icon').addClass('fa-volume-down');
    } else {
      $('#volume-icon').addClass('fa-volume-up');
    }
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

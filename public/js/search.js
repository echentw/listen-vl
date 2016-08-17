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

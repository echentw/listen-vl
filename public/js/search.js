$(document).ready(function() {
  var AUTOCOMPLETE = true;
  var ANIMATE = true;

  var search = function() {
    // Make the search box slide up.
    $('.search-container').css('margin', '0% auto');

    // Hide the autocomplete menu.
    AUTOCOMPLETE = false;
    $(".ui-autocomplete").hide();

    var query = $('#search-box').val();
    var request = gapi.client.youtube.search.list({
      q: query,
      type: 'video',
      part: 'snippet',
      maxResults: 20
    });

    var showResults = function(response) {
      for (var i = 0; i < response.result.items.length; ++i) {
        var item = response.result.items[i];
        var title = item.snippet.title;

        if (item.id.videoId) {
          var videoId = item.id.videoId;
          var link = '/listen?id=' + videoId;
          $('.search-results').append(
            '<div class="search-result">' +
              '<a href="' + link + '" class="video-link" id="' + videoId + '">' +
                title +
              '</a><br>' +
            '</div>'
          );
        }
      }
    };

    request.execute(function(response) {
      $('.search-results').empty();
      if (ANIMATE) {
        ANIMATE = false;
        $('.search-results').css('height', '500px');
        setTimeout(function() {
          showResults(response);
        }, 500);
      } else {
        showResults(response);
      }
    });
  };

  $('#search-button').click(function() {
    search();
  });
  $('#search-box').on('keydown', function(e) {
    if (e.which == 13) {
      search();
    } else {
      AUTOCOMPLETE = true;
    }
  });

  // Logic for autocomplete.
  $('#search-box').autocomplete({
    source: function(request, callback) {
      var query = request.term;
      $.ajax({
        dataType: 'jsonp',
        url: 'http://suggestqueries.google.com/complete/search?q=' + query + '&client=youtube&ds=yt',
        success: function(data) {
          if (!AUTOCOMPLETE) {
            return;
          }
          var suggestions = [];
          $.each(data[1], function(key, val) {
            // console.log(key + ', ' + val);
            suggestions.push(val[0]);
          });
          callback(suggestions);
        }
      });
    }
  });
});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag = $('#player')
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// player.loadVideoById({videoId:String, startSeconds:Number, endSeconds:Number, suggestedQuality:String});
// player.setVolume(volume:Number):Void
// player.getVolume():Number

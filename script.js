// upon document.ready() uses Twitch.tv api to check channels' status and then dynamically constructs channel display as a series of unorderd lists

var twitchAPI = 'https://wind-bow.gomix.me/twitch-api/';
var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "hardlydifficult", "akjanvaeiu"];
var $channelElem = $('#channelDisplay');

function checkStatus(channelList) {
  for (var i = 0; i < channelList.length; i++) {
    var url = twitchAPI + 'streams/' + channelList[i]+ '?callback=?';
    var channel = channelList[i];
    $.getJSON(url, function(data) {
      if(!data.stream) {
        userOffline(data); 
      } else {
        userOnline(data);
      }
    });
  }
}

function userOffline(streamInfo) {
  var user = streamInfo._links.self.substring(streamInfo._links.self.lastIndexOf("/")+1);
  var url = twitchAPI + 'users/' + user + '?callback=?';
  $.getJSON(url, function(userInfo){
    if (userInfo.error) {
      $channelElem.append('<ul class="channel notChannel"><li>?</li><li>'+userInfo.message+'</li><li>Error: Status 404</li></ul>');
    }
    else {
      var logo;
      if (!userInfo.logo ) {
        logo = "!";
      }
      else {
        logo = "<img src='"+userInfo.logo+"'/>";
      }
      $channelElem.append('<ul class="channel offline"><li>'+logo+
      '</li><li><a href=https://twitch.tv/'
      +userInfo.name+' target="_blank">'+userInfo.display_name+'</a></li><li>User Offline</li></ul>');
    }
  });
}

function userOnline(streamInfo) {
  var logo;
  if (!streamInfo.stream.channel.logo) {
    logo = "!";
  }
  else {
    logo = "<img src='"+streamInfo.stream.channel.logo+"'/>";
  }
  $channelElem.append('<ul class="channel online"><li>'+logo+'</li><li><a href="'+streamInfo.stream.channel.url+'" target="_blank">'
  +streamInfo.stream.channel.display_name+'</a></li><li>'+streamInfo.stream.channel.status+'</li></ul>');  
}

// functions to hide and show appropriate channels
function showAll() {
    $('.channel').removeClass('hide');
}

function showOnline() { 
    $('.channel').addClass('hide');
    $('.online').removeClass('hide');
}

function showOffline() {
  $('.channel').addClass('hide');
  $('.offline').removeClass('hide');
}  

// make it go!
$(document).ready(function() {
   checkStatus(channels);
});

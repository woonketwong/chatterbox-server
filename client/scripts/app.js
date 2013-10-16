var thisUser = {
  username: "anonymous",
  room: "lobby",
  friends: {}
};

//var url = 'http://127.0.0.1:8080/1/classes/chatterbox'
var msgsUrl = 'http://127.0.0.1:8080/classes/messages';

var rooms = {"lobby": true};
var lastMessage = 0;
$(document).ready(function(){
  console.log("Hi");
  getUserName();
  getMessages();
  var cycleNewMessages = setInterval(getMessages, 3000);

  $('#submitChat').on('click', function(e){
    e.preventDefault();
    var chatMessage = $('#chatText').val();
    $('#chatText').val("");
    var newChatMessage = {
     'username': thisUser.username,
     'text': chatMessage,
     'roomname': thisUser.room
    };
    sendMessages(newChatMessage);
  });

  $('#chat-box').on('click', "a.chatterName", function(e){
    e.preventDefault();
    var friendClick = $(this).text();
    if (thisUser.friends[friendClick] !== undefined){
      var removeFriend = prompt('You are already friend with ' + friendClick + '. Remove them from friends list? (y/n)');
      if (removeFriend === 'y' || removeFriend === 'Y') {
        delete thisUser.friends[friendClick];
        $('#friendList .currentFriend:contains('+friendClick+')').remove();
      }
    } else {
      thisUser.friends[friendClick] = friendClick;
      alert(friendClick + ' added as friend.');
      $('#friendList .sidebar-list').append('<a href="#" class="currentFriend"><p>' + friendClick + '</p></a>');
    }
  });

  $('#friendList').on('click', "a.currentFriend", function(e){
    e.preventDefault();
    friendClick = $(this).text();
    var removeFriend = prompt('Remove ' + friendClick + ' from friends list? (y/n)');
    if (removeFriend === 'y' || removeFriend === 'Y') {
      delete thisUser.friends[friendClick];
      $('#friendList .currentFriend:contains('+ friendClick +')').remove();
    }
  });

  $('#makeRoomButton').on('click', function(e){
    e.preventDefault();
    var newRoomName = $('#newRoomName').val();
    if(!newRoomName){
      alert("Please enter a room name");
    } else {
      if (!rooms.hasOwnProperty(newRoomName)){
        rooms[newRoomName] = true;
        alert('New room created. Joining that room.');
        $('.userRoom').text(newRoomName);
        $('#roomList .sidebar-list').append('<a href="#" class="currentRoom"><p>' + newRoomName + '</p></a>');
      } else {
        alert('Room already exists. Moving you to that room.');
        $('.userRoom').text(newRoomName);
      }
      thisUser.room = newRoomName;
    }
  });

});

var getUserName = function() {
  var search = location.search.substring(1);
  var URLparams = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
  thisUser.username = URLparams.username;
  $('.userName').text(thisUser.username);
  $('.userRoom').text(thisUser.room);
};

var sendMessages = function(newChatMessage){
  console.log("send message");
  $.ajax({
    url: msgsUrl,
    type: 'POST',
    data: JSON.stringify(newChatMessage),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var getMessages = function(){
  $.ajax({
    url: msgsUrl,
    type: 'GET',
    //data: { order: '-createdAt' },
    //contentType: 'application/json',
    dataType: "json",
    success: function (data) {
      console.log(data);
      addNewMessages(data.results);
      console.log(JSON.stringify(data.results[0]));
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

};

var addNewMessages = function(messages) {
  for (var i = messages.length - 1; i >= 0; i --) {
    var thisMessageDate = new Date(messages[i].createdAt);
    if (thisMessageDate > lastMessage) {
      if (rooms[messages[i].roomname] === undefined) {
        $('#roomList .sidebar-list').append('<a href="#" class="currentRoom"><p>' + messages[i].roomname + '</p></a>');
        rooms[messages[i].roomname] = true;
      }
      if (messages[i].roomname === thisUser.room){
        var safeString = makeSafeString(messages[i].text);
        var thisDate = convertTime(messages[i].createdAt);
        lastMessage = new Date(messages[i].createdAt);
        if (thisUser.friends[messages[i].username]) {
          $('#chat-box').prepend("<div class='chat-container friend'><p class='chat-user'>On "+ thisDate + " <a href='#' class='chatterName'>" + messages[i].username + "</a> said:</p><p class='chat-string'>"+ safeString + "</p>" );
        } else {
          $('#chat-box').prepend("<div class='chat-container'><p class='chat-user'>On "+ thisDate + " <a href='#' class='chatterName'>" + messages[i].username + "</a> said:</p><p class='chat-string'>"+ safeString + "</p>" );
        }
      }
    }
  }
  // // only keep the 20 most recent messages
  if ($('#chat-box').children().length > 20) {
    $('#chat-box').find('div:nth-child(n+21)').remove();
  }
};

var makeSafeString = function(string) {
  var newSafeString = "";
  for (var i = 0; i < string.length; i++){
    if(string[i] === '&') {
      newSafeString += '&amp';
    } else if (string[i] === '<') {
      newSafeString += '&lt';
    } else if (string[i] === '>') {
      newSafeString += '&gt';
    } else if (string[i] === '"') {
      newSafeString += '&quot';
    } else if (string[i] === "'") {
      newSafeString += '&#x27';
    } else if (string[i] === '/') {
      newSafeString += '&#x2F';
    } else {
      newSafeString += string[i];
    }
  }
  return newSafeString;
};

var convertTime = function(time) {
  thisDate = new Date(time);
  var month  = (thisDate.getMonth() + 1);
  var day = thisDate.getDate();
  var year = thisDate.getFullYear();
  var hour = thisDate.getHours();
  var amPm = (hour > 12) ? "pm" : "am";
  if (hour !== 12) {
    hour = (hour > 12) ? hour-12 : hour;
  }
  var minutes = thisDate.getMinutes();

  minutes = ('0' + minutes).slice(-2);
  thisDate = day + "/" + month + "/" + year + " at " + hour + ":" + minutes + amPm;
  return thisDate;
}

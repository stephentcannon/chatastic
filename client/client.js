if(!Session.get('room_id')) {
  Session.set('room_id', null);
  Session.set("room_name", null);
}

Meteor.subscribe("allusers");

// borrowed from Britto tk JonathanKingston
Chatastic = {};

Chatastic.log = function(message) {
  if(console && console.log) {
    console.log(message);
  }
}

Chatastic.init = function() {
  Chatastic.log('init');
  if (!Session.get('room_id')) {
    //console.log("subscribe chatrooms !Session.get('room_id'): " + Session.get('room_id'));
    Chatastic.setSession('Lobby');
  }
}

Chatastic.setSession = function(room_name){
  console.log('Chatastic.setSession room_name: ' + room_name);
  var room = Rooms.findOne({name: room_name});
  if (room){
    Session.set("room_id", room._id);
    Session.set("room_name", room.name);
  } else {
    room = Rooms.findOne({name: 'Lobby'});
    Session.set("room_id", room._id);
    Session.set("room_name", room.name);
  }
}

Meteor.subscribe("chatrooms", Chatastic.init);

Meteor.autosubscribe(function () {
  Chatastic.log('autosubscribing to: ' + Session.get("room_id")); 
  Meteor.subscribe("messages", Session.get("room_id"));
});
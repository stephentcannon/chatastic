if(!Session.get('room_id')) {
  Session.set('room_id', null);
  Session.set("room_name", null);
}

Meteor.subscribe("allusers");

// borrowed from Britto tk JonathingKingston
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
    Router.setRoom('Lobby');
  }
  Backbone.history.start({pushState: true});
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
  $('#messages_board').fadeIn('slow');
}

Meteor.subscribe("chatrooms", Chatastic.init);

////////// Tracking selected Room._id in URL //////////

var ChatasticRouter = Backbone.Router.extend({
  routes: {
    ":room_name": "main"
  },
  main: function (room_name) {
    Chatastic.setSession(room_name);
  },
  setRoom: function (room_name) {
    //console.log('router setRoom room_name: ' + room_name);
    this.navigate(room_name, true);
  }
});

Router = new ChatasticRouter;

Meteor.autosubscribe(function () {
    Chatastic.log('autosubscribing to: ' + Session.get("room_id"))
    Meteor.subscribe("messages", Session.get("room_id"));
});


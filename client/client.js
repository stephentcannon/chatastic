Session.set('room_id', null);

Meteor.subscribe("allusers");

Meteor.subscribe("chatrooms", function(){
  if (!Session.get('room_id')) {
    var room = Rooms.findOne({name: 'Lobby'});
    console.log('setting default room: ' + room._id);
    Router.setRoom(room._id);
  }
});

// borrowed from Britto tk JonathingKingston
Chatastic = {};

Chatastic.log = function(message) {
  if(console && console.log) {
    console.log(message);
  }
}

////////// Tracking selected Room._id in URL //////////

var ChatasticRouter = Backbone.Router.extend({
  routes: {
    ":room_id": "main"
  },
  main: function (room_id) {
    console.log('in router main room_id: ' + room_id);
    Session.set("room_id", room_id);
  },
  setRoom: function (room_id) {
    console.log('in setRoom function room_id: ' + room_id);
    this.navigate(room_id, true);
  }
});

Router = new ChatasticRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

Meteor.autosubscribe(function () {
    Chatastic.log('autosubscribing to: ' + Session.get("room_id"))
    Meteor.subscribe("messages", Session.get("room_id"));
});


Template.rooms.rooms = function() {
    return Rooms.find();
};

Template.room.events = {
	'mousedown': function(evt) {
    Router.setRoom(this._id);
  }
};

Template.room.is_active = function(){
  console.log('Template.room.is_active : ' + this._id);
  return Session.equals('room_id', this._id) ? 'active' : '';
}

Template.messages.messages = function() {
	return Messages.find();
}

Template.message.get_username = function(id){
	return Users.findOne({_id: id}).name;
}

////////// Helpers for in-place key button event handling //////////

// Returns an event_map key for attaching "ok/cancel" events to
// a text input (given by selector)
var okcancel_events = function (selector) {
  return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
};

// Creates an event handler for interpreting "escape", "return", and "blur"
// on a text field and calling "ok" or "cancel" callbacks.
var make_okcancel_handler = function (options) {
  var ok = options.ok || function () {};
  var cancel = options.cancel || function () {};

  return function (evt) {
    if (evt.type === "keydown" && evt.which === 27) {
      // escape = cancel
      cancel.call(this, evt);

    } else if (evt.type === "keyup" && evt.which === 13 ) {
      // blur/return/enter = ok/submit if non-empty
      // removed || evt.type === "focusout" because we don't want to post data on event out
      var value = String(evt.target.value || "");
      if (value)
        ok.call(this, value, evt);
      else
        cancel.call(this, evt);
    }
  };
};

var btnclick_events = function(selector) {
  return 'click '+selector;
};


var make_btnclick_handler = function(options) {
  var ok = options.ok || function() {};
  var cancel = options.cancel || function () {};

  return function (evt){
    if (evt.type === "click"){
      var postEntry = $("#messageBox");
      var postEntryValue = $("#messageBox").val();
      if (postEntryValue !== ""){
        ok.call(this, postEntryValue, postEntry);
      }else{
        cancel.call(this, evt);
      }
    } else {
      cancel.call(this, evt);
    }
  }
}

Template.entry.events = {};

Template.entry.events[okcancel_events('#messageBox')] = make_okcancel_handler({
  ok: function(text, event){
    var ts = Date.now();
    Messages.insert({
			room_id: Session.get('room_id'),
      message: text,
      created_by: 'a5043b57-e5f1-49ee-8c2a-4ed2b77c8699', //TODO have to implement userid later
      created: ts
    });
    event.target.value = "";
  }
});

Template.entry.events[btnclick_events('#messageBtn')] = make_btnclick_handler({
  ok: function(text, event){
    var ts = Date.now();
    Messages.insert({
			room_id: Session.get('room_id'),
      message: text,
      created_by: 'a5043b57-e5f1-49ee-8c2a-4ed2b77c8699', //TODO have to implement userid later
      created: ts
    });
    $("#messageBox").val('');
  }
});
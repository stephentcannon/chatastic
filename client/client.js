
var timeStart = new Date().getTime();

Chatastic = {};

Chatastic.init = function() {
  Chatastic.log('init');
  if(Session.get("currentRoomId") === undefined){
		defaultRoom = Rooms.findOne();
		Chatastic.log('default room id: ' + defaultRoom._id);
		Chatastic.log('default room name: ' + defaultRoom.name);
		Session.set('currentRoomId', defaultRoom._id);
		// TODO the below is not working, DOM might not be loaded?
		$('#'+defaultRoom._id).addClass('active');
	}
}

Chatastic.log = function(message) {
  if(console && console.log) {
    console.log(message);
  }
}

Meteor.subscribe("allusers");
Meteor.subscribe("chatrooms", Chatastic.init);


Meteor.autosubscribe(function () {
		Chatastic.log('autosubscribing to: ' + Session.get("currentRoomId"))
	  Meteor.subscribe("messages", Session.get("currentRoomId"));
	});

Template.rooms.rooms = function() {
    return Rooms.find();
};

Template.room.events = {
	'click .select_room': function() {
		var old_id = Session.get('currentRoomId');
		$('#'+old_id).removeClass('active');
		$('#'+old_id).addClass('select_room');
		$('#'+this._id).addClass('active');
		$('#'+this._id).removeClass('select_room');
		var new_id = this._id;
		$("#messages_board").fadeToggle(1000, "linear", function(){
			Session.set('currentRoomId', new_id); //was this._id but didn't bubble through
			$("#messages_board").fadeToggle(1000, "linear");			
		});
		 
  }
};

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
			room_id: Session.get('currentRoomId'),
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
			room_id: Session.get('currentRoomId'),
      message: text,
      created_by: 'a5043b57-e5f1-49ee-8c2a-4ed2b77c8699', //TODO have to implement userid later
      created: ts
    });
    $("#messageBox").val('');
  }
});
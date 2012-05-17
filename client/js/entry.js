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
    console.log('messageBox event');
    console.log("Session.get('room_id'): " + Session.get('room_id'));
    insertLocalMessage(text);
    event.target.value = "";
  }
});

Template.entry.events[btnclick_events('#messageBtn')] = make_btnclick_handler({
  ok: function(text, event){
    console.log('messageBtn event');
    console.log("Session.get('room_id'): " + Session.get('room_id'));
    insertLocalMessage(text);
    $("#messageBox").val('');
  }
});

function insertLocalMessage(vtext){
  //TODO change userid to Session.get('user_id') once security is in place
  console.log('insertLocalMessage');
  Meteor.call('insertMessage', {
    room_id: Session.get('room_id'), 
    user_id: '6ca3d58c-5e13-4fe6-813a-aa40ea5b158c', 
    text: vtext,
    });
}

function insertMessage(){
  console.log('insertLocalMessage stub');
}
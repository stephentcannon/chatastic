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
    console.log('messageBox event');
    console.log("Session.get('room_id'): " + Session.get('room_id'));
    var ts = Date.now();
    Messages.insert({
      room_id: Session.get('room_id'),
      message: text,
      created_by: 'f33efff5-dd17-48de-b5c8-c896ab014b5f', //TODO have to implement userid later
      created: ts
    });
    event.target.value = "";
  }
});

Template.entry.events[btnclick_events('#messageBtn')] = make_btnclick_handler({
  ok: function(text, event){
    console.log('messageBtn event');
    console.log("Session.get('room_id'): " + Session.get('room_id'));
    var ts = Date.now();
    Messages.insert({
      room_id: Session.get('room_id'),
      message: text,
      created_by: 'f33efff5-dd17-48de-b5c8-c896ab014b5f', //TODO have to implement userid later
      created: ts
    });
    $("#messageBox").val('');
  }
});
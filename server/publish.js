Meteor.publish("chatrooms", function() {
  return Rooms.find();
});

Meteor.publish("messages", function(room_id) {
  return Messages.find({room_id: room_id});
});

Meteor.publish("allusers", function() {
  return Users.find({}, {fields: {password: 0}});
});

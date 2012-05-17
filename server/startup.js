Meteor.startup(function () {
  _.each(['Users', 'Rooms', 'Messages'], function(collection) {
    _.each(['update', 'remove'], function(method) {
      Meteor.default_server.method_handlers['/' + collection + '/' + method] = function() {};
    });
  });

   if(Rooms.find().count() === 0) {
      console.log('Bootstrapping Users, Rooms and Messages.  Please wait...');
      var ts = Date.now();
      
      adminid = Users.insert({
        name: 'Administrator',
        login: 'admin',
        password: 'password'
      });
      console.log('User Admin ID: ' + adminid);

      rid1 = Rooms.insert({
        name: 'Lobby',
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Lobby Room ID: ' + rid1);
      mid1 = Messages.insert({
        room_id: rid1,
        message: 'Welcome to the Chatastic Lobby!',
        created_by: adminid,
        created: ts
      });
      console.log('Lobby init Message ID: ' + mid1);

      rid2 = Rooms.insert({
        name: 'Gossip', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Gossip Room ID: ' + rid2);
      mid2 = Messages.insert({
        room_id: rid2,
        message: 'Welcome to the Gossip Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Gossip init Message ID: ' + mid2);

      rid3 = Rooms.insert({
        name: 'Rumors', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Rumors Room ID: ' + rid3);
      mid3 = Messages.insert({
        room_id: rid3,
        message: 'Welcome to the Rumors Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Rumors init Message ID: ' + mid3);

      rid4 = Rooms.insert({
        name: 'Innuendo', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Innuendo Room ID: ' + rid4);
      mid4 = Messages.insert({
        room_id: rid4,
        message: 'Welcome to the Innuendo Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Innuendo init Message ID: ' + mid4);

      rid5 = Rooms.insert({
        name: 'Jokes', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Jokes Room ID: ' + rid5);
      mid5 = Messages.insert({
        room_id: rid5,
        message: 'Welcome to the Jokes Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Jokes init Message ID: ' + mid5);

      console.log('Bootstrapping complete.');

   }

});
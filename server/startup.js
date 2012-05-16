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
        name: 'Meteor', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Meteor Room ID: ' + rid2);
      mid2 = Messages.insert({
        room_id: rid2,
        message: 'Welcome to the Meteor Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Meteor init Message ID: ' + mid2);

      rid3 = Rooms.insert({
        name: 'Mongodb', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Mongodb Room ID: ' + rid3);
      mid3 = Messages.insert({
        room_id: rid3,
        message: 'Welcome to the Mongodb Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Mongodb init Message ID: ' + mid3);

      rid4 = Rooms.insert({
        name: 'Javascript', 
        moderator: adminid,
        created_by: adminid,
        created: ts
      });
      console.log('Javascript Room ID: ' + rid4);
      mid4 = Messages.insert({
        room_id: rid4,
        message: 'Welcome to the Javascript Room!',
        created_by: adminid,
        created: ts
      });
      console.log('Javascript init Message ID: ' + mid4);

      console.log('Bootstrapping complete.');
      console.log('Login as admin and password.');
   }

});
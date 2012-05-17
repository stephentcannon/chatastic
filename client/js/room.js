Template.room.events = {
  'mousedown': function(evt) {
    console.log('Template.room.events');
    evt.stopPropagation();
    Router.setRoom(this.name);
  }
};

Template.room.is_active = function(){
  //console.log('is_active: ' + this._id + ' - ' + this.name);
  //console.log("is_active Session.get('room_id'): " + Session.get('room_id'));
  return Session.equals('room_id', this._id) ? 'active' : '';
}
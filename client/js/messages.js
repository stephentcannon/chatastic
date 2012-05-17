Template.messages.messages = function() {
  return Messages.find();
}

Template.message.get_username = function(id){ 
  return Users.findOne({_id: id}).name;
}
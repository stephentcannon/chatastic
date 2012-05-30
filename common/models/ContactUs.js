ContactUs = new Meteor.Collection("ContactUs");
ContactUs.Utils = new Utils();

ContactUs.validateParams = function(params) {
  this.Utils.validateParams(params);
}

ContactUs.validateEmail = function(email) {
  this.Utils.validateEmail(email);
}
$(function() {
  $("#name").focus();
});

Template.contactus.events = {
  'click #btnContact': function (event) {
    var params = $('#contact-form').toJSON();
    try{
      ContactUs.validateParams(params);
      ContactUs.validateEmail(params.email);
      $('#buttons-contact').fadeOut(1000, function(){
        $('#progress-contact').fadeIn(1000, function(){
         $('#bar-contact').width('66%');
         Meteor.call('insertContactUs', params, function (error, result) { 
            if(result){
              $('#bar-contact').width('100%');
              $('#progress-contact').fadeOut(1000, function(){
                $('#bar-contact').width('33%');
                $('#contact-form').fadeOut(2000, function(){
                  $('#buttons-contact').show();
                });
                Alert.setAlert('awesome!', result, 'alert-success', 'contact');
                $('#contactUsDialog').fadeOut(3000, function(){
                  $('#contactUsDialog').modal('hide');
                  $('#contact-form').show();
                  $("#contact-form").reset();
                }) 
              });
            } else {
              $('#progress-contact').fadeOut(1000, function(){
                $('#bar-contact').width('33%');
                Alert.setAlert('uh-oh!', error + error.reason, 'alert-error', 'contact');
                $('#buttons-contact').fadeIn(1000);
              });
            }
         });
        });
      }); 
    } catch(error) {
      Alert.setAlert('uh-oh!', error.reason, 'alert-error', 'contact');
    }
  }
}

function insertContactUs(){
  // TODO not sure if this goes here
  this.unblock();
}
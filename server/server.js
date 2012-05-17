var require = __meteor_bootstrap__.require;

var path = require("path");
var fs = require('fs');
var base = path.resolve('.');
if (base == '/'){
  base = path.dirname(global.require.main.filename);   
}

var email;
var emailPath = 'node_modules/nodemailer';
var publicEmailPath = path.resolve(base+'/public/'+emailPath);
var staticEmailPath = path.resolve(base+'/static/'+emailPath);
if (path.existsSync(publicEmailPath)){
  emailer = require(publicEmailPath);
}
else if (path.existsSync(staticEmailPath)){
  emailer = require(staticEmailPath);
}
else{
  console.log('WARNING Emailer not loaded. Node_modules not found');
}

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = emailer.createTransport('SMTP',{
    service: config.emailer.service,
    auth: {
        user: config.emailer.user,
        pass: config.emailer.pass
    }
});

function sendEmail(subject, body, htmlbody, to, from, bcc){
  var mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: body,
      html: htmlbody 
  }
  smtpTransport.sendMail(mailOptions 
    ,function(error, response){
      if(error){
        console.log(error);
      }else{
        console.log("Message sent: " + response.message);
        console.log("To: " + to);
      }
      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
    }
  );
}

Meteor.methods({
  insertContactUs: insertContactUs,
  insertMessage: insertMessage
});

function insertMessage(params){
  console.log('insertMessage');
  this.unblock();
  // TODO make sure not blank
  // TODO make sure user is logged in and has active session
  // TODO make sure user is in room posting too
  if(params){
    var ts = Date.now();
    msg_text = params.text.slice(0,300);
    id = Messages.insert({
      room_id: params.room_id,
      message: msg_text,
      created_by: params.user_id,
      created: ts
    });
    if(id){
      return result = 'Success';
    } else {
      throw new Meteor.Error(500, 'Zoinkies! Internal Server Error. Unable to save message.');
    }
  } else {
    throw new Meteor.Error(500, 'Zoinkies! Internal Server Error. Missing params.');
  }
}


function insertContactUs(params){
  console.log('insertContactUs');
  this.unblock();
  if(params){
    ContactUs.validateParams(params);
    ContactUs.validateEmail(params.email);
    var ts = Date.now();
    id = ContactUs.insert({
    created: ts, 
    name: params.name.slice(0,100),
    email: params.email.slice(0,100),
    subject: params.subject.slice(0,30),
    comments: params.comments.slice(0,1000)
    });
    if(id){
      sendEmail('Thank you for contacting us', 
        'Thank you for contacting us.  We will review your request and get back to you if necessary. Subject type:\n'+params.subject+'\nComments:\n'+params.comments+'\n\nThanks,\nThe Chatastic team',
        '<html><h1>Thank you for contacting us.</h1><p>We will review your comments and get back to you if necessary.</p><p>Subject: '+params.subject+'</p><p>Comments:</p>'+params.comments+'<p>Thanks,<br/>The Chatastic team</p></html>',
        params.name+'<'+params.email+'>',
        config.email_from
      );
      sendEmail('Chatastic Contact Form Submission: ' + params.subject,
        'Comments\n' + params.comments,
        '<html><p>From: '+params.name+'<'+params.email+'></p><p>Subject: '+params.subject+'</p><p>Comments:</p>'+params.comments+'</html>',
        config.email_to,
        params.name+'<'+params.email+'>'
      );
      return result = 'Thank you kindly!';
    } else {
      throw new Meteor.Error(500, 'Zoinkies! Internal Server Error. Failed to insert "contact us" request. Please retry.');
    }
  } else {
    throw new Meteor.Error(500, 'Zoinkies! Internal Server Error. Missing params.');
  }
}
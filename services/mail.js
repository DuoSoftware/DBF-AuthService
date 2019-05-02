const utils = require('../utils'), 
  SESClient = require('./ses');

class Email {
  constructor() {
    this.Sender;
    this.Subject;
    this.ToAddresses = [];
    this.CcAddresses = [];
    this.Body = {};
  }

  subject(subject) {
    if (subject) 
      this.Subject = subject;

    return this;
  }

  to(recipent) {
    if (recipent && utils.HasValidEmail(recipent))
      this.ToAddresses.push(recipent);

    return this;
  }
  
  toMany(recipents) {
    if (Array.isArray(recipents))
      this.ToAddresses = recipents;

    return this;
  }

  cc(ccRecipents) {
    if (Array.isArray(ccRecipents))
      this.CcAddresses = ccRecipents;
    
    return this;
  }

  from(email, name) {
    if (email && utils.HasValidEmail(email)) {
      this.Sender = { address: email }
    }

    if (name) 
      this.Sender['name'] = name;

    return this;
  }
 
  htmlBody(htmlBody) {
    if (htmlBody) 
      this.Body['html'] = htmlBody;

    return this;
  }

  textBody(textBody) { 
    if (textBody)
      this.Body['text'] = textBody;

    return this;
  }

  send() {
    if (this.ToAddresses.length < 0)
      throw new Error("No recipients found.");

    if (!this.Sender)
      throw new Error("No sender found.");
      
    if (!this.Body['html'] && !this.Body['text']) 
      throw new Error("No email body found.");

    let params = {
      from: this.Sender, // sender address 
      to: this.ToAddresses,
      cc: this.CcAddresses,
      subject: this.subject,
      text: this.Body['text'],
      html: this.Body['html']
    }

    let ses = new SESClient();
    ses.send(params);
  }
}

module.exports = Email;
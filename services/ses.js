const config = require('config'),
  nodemailer = require('nodemailer');

class SESClient {
  constructor() {
    this.smtpTrasport = nodemailer.createTransport({
      host: config.SES.host,
      port: config.SES.port, // 587
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.SES.username, // generated ethereal user
        pass: config.SES.password, // generated ethereal password
      }
    });
  }

  async send(mailData) {
    if (mailData) {
      try {
        let response = await this.smtpTrasport.sendMail(mailData);
        console.log(response);
      } catch (error) {
        console.log(error);        
      }
    }
  }
}

module.exports = SESClient;
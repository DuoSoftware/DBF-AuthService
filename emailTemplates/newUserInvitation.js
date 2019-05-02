let htmlBody = `<!DOCTYPE html>
<html style="font-family: Sans-serif;text-align: center;padding: 20px;font-size: 14px">
<div>
  <div 
    style="padding: 0 20%;text-align: center;min-height: 600px;width: 700px;
    background: conic-gradient(from 220deg,#fff, #f5f5f5)">
      <img 
        src="https://smoothflow.io/images/sf-full-small.jpg" 
        style="margin-bottom:50px;width:340px;margin: 0 auto 50px auto;display: block" />
      <h1 
        style="font-size: 30px;font-weight: bold;padding: 0 20%;margin-bottom: 20px;color: green;">Hello {{name}}!
      </h1>
      <div 
        <p>
          To activate your account, please use following verification code
        </p>
        <span>{{verificationCode}}</span>
      </div>
      <div style="margin-top: 50px;padding: 0 20%;line-height: 25px">
        <p>Many thanks,</p>
        <p style="font-weight: bold">Smoothflow Team</b>
      </div>
  </div>
</div>
</html>`

let textBody = ""

module.exports = { html: htmlBody, text: textBody }
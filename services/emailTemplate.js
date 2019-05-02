const getTemplate = (name) => {
  let template = null;

  switch (name) {
    case 'invite_existing_user':
      template = require('../emailTemplates/existingUserInvitiation'); 
      break;
    case 'invite_new_user':
      template = require('../emailTemplates/newUserInvitation'); 
      break;
    default:
      break;
  }

  return template;
}

class EmailTemplate {
  constructor(name) {
    this.template = getTemplate(name);
    if (!this.template) throw new Error('No email template found.');
  }

  format(context) {
    let 
      formattedSubject = this.template.subject || "",
      formattedHtmlTemplate = this.template.html || "",
      formattedTextTemplate = this.template.text || "";

    for (const key of Object.keys(context)) {
      var regExp = new RegExp(`{{${key}}}`,'g');
      formattedSubject = formattedSubject.replace(regExp, context[key]);
      formattedHtmlTemplate = formattedHtmlTemplate.replace(regExp, context[key]);
      formattedTextTemplate = formattedTextTemplate.replace(regExp, context[key]);
    }

    return {
      subject: formattedSubject,
      html: formattedHtmlTemplate,
      text: formattedTextTemplate
    };
  }
}

module.exports = EmailTemplate;
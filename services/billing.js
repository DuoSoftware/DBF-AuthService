const config = require("config"), 
  request = require("request");

module.exports.GetSubscription = (billingAccount, workspaceId, projectId, token) => {
  return new Promise((resolve, reject) => {
    request({ 
      url: `${config.Services.billingServiceProtocol}://${config.Services.billingServiceHost}/validateAccount/${billingAccount}`,
      headers: {
        'Authorization': `${token}`,
        'companyInfo': `${workspaceId}:${projectId}`
      },
      json: true
    }, function (err, config, body) {
      if (err) {
        reject(err);
      } else {
        if (body.IsSuccess) { // active subscription available
          resolve({status: 'active', subscription: body});
        } else {
          resolve({status: 'expired'}); // subscription expired
        }
      }
    });
  });
}
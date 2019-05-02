const utils = require('../utils');
const config = require('config');
const AWS = require('aws-sdk');
const Promise = require("bluebird");

const pool_region = config.Cognito.region;

AWS.config.update({
  region: config.Cognito.region,
  accessKeyId: 'AKIAI7V7BG4XZBMUVLKQ',
  secretAccessKey: '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',
  UserPoolId: config.Cognito.userpoolId
});

module.exports.CreateUser = (user) => {
  return new Promise((resolve, reject) => {

    if (!user || !user.username) {
      console.log("AdminCreateUser:: Required parameter 'username' not found.");
      return;
    }

    let params = {
      Username: user.username,
      TemporaryPassword: user.temporaryPassword,
      UserPoolId: config.Cognito.userpoolId
    }

    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

    cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });

  });
};
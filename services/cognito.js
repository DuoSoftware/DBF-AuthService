const utils = require('../utils');
const config = require('config');
const AWS = require('aws-sdk');
const Promise = require("bluebird");

const pool_region = config.Cognito.region;

AWS.config.update({
  region: config.Cognito.region,
  accessKeyId: config.AWS.accessKey,
  secretAccessKey: config.AWS.secretKey,
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

module.exports.GetUser = (username) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      console.log("GetUser:: Required parameter 'username' not found.");
      return;
    }

    let params = {
      Username: username,
      UserPoolId: config.Cognito.userpoolId
    }

    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

    cognitoidentityserviceprovider.adminGetUser(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports.ChangePassword = (oldPassword, newPassword, access_token) => {
  return new Promise(function (resolve, reject) {
    var params = {
      AccessToken: access_token, /* required */
      PreviousPassword: oldPassword, /* required */
      ProposedPassword: newPassword /* required */
    };

    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

    cognitoidentityserviceprovider.changePassword(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports.UpdateProfile = (username, attributes) => {
  return new Promise(function (resolve, reject) {
    if (!username) {
      console.log("UpdateProfile:: Required parameter 'username' not found.");
      return;
    }

    let userAttributes = [];
    for (const key in attributes) {
      let obj = {};
      obj["Name"] = key;
      obj["Value"] = attributes[key];
      userAttributes.push(obj);
    }

    var params = {
      "UserAttributes": userAttributes,
      "Username": username,
      "UserPoolId": config.Cognito.userpoolId
    }

    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

    cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
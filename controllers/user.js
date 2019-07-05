const utils = require('../utils'), 
  cognito = require('../services/cognito');

module.exports.GetUser = async (req, res, next) => {
  console.log("User::Get User");

  let authuser = req.user;

  try {
    let user = await cognito.GetUser(authuser.sub);
    res.send(utils.Success(200, "Successfully changed the password", user));
  } catch (error) {
    res.send(utils.Error(500, error.message || 'Error getting while changing the password', undefined));
  }
}

module.exports.UpdateProfile = async (req, res) => {
  console.log("User::Update Profile");

  let payload = req.body;
  let authuser = req.user;

  try {
    await cognito.UpdateProfile(authuser.sub, payload);
    let user = await cognito.GetUser(authuser.sub);
    res.send(utils.Success(200, "Successfully updated user atrributes", user));
  } catch (error) {
    res.send(utils.Error(500, error.message || 'Error getting while updating user attributes', undefined));
  }
};

module.exports.ChangePassword = async (req, res) => {
  console.log("User::Change Password");

  let payload = req.body;
  let authuser = req.user;

  let validateParamResponse = utils.ValidateParams(payload, ["old_password", "new_password", "access_token"]);
  if (!validateParamResponse.status) {
    console.log("Required parameters empty or not found", validateParamResponse.list);

    res.status(400);
    res.send(utils.Error(400, "Required parameters empty or not found", validateParamResponse.list));
    return;
  }

  if (payload.old_password === payload.new_password) {
    res.status(400);
    res.send(utils.Error("Old and new passwords cannot be the same", undefined));
    return;
  }

  try {
    let status = await cognito.ChangePassword(payload.old_password, payload.new_password, payload.access_token);
    res.send(utils.Success(200, "Successfully changed the password", undefined));
  } catch (error) {
    res.send(utils.Error(500, error.message || 'Error getting while changing the password', undefined));
  }
}
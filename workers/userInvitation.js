const invitation = require('dbf-dbmodels/Models/UserInvitation').UserInvitation;

module.exports.Create = async (data) => {
  return await invitation(data).save();
};

module.exports.Get = async (context, fields={}) => {
  return await invitation.find(context).select(fields);
}

module.exports.GetOne = async (context) => {
  return await invitation.findOne(context);
}

module.exports.UpdateOne = async (context, data) => {
  return await invitation.findOneAndUpdate(context, data);
}
const usermigration = require('dbf-dbmodels/Models/UserMigration').usermigration;

module.exports.GetOne = async (context) => {
  return await usermigration.findOne(context);
}

module.exports.UpdateOne = async (context, data) => {
  return await usermigration.findOneAndUpdate(context, data);
}
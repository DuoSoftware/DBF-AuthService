const usermigration = require('dbf-dbmodels/Models/UserMigration').usermigration;

module.exports.GetOne = async (context) => {
  return await usermigration.findOne(context);
}
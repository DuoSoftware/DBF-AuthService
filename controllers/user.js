const UserWorker = require('../workers/user');

module.exports.InviteUser = (req, res) => {
    // check user already exists 
    let user = await UserWorker.GetOne({
      userName: user.sub
    }).catch((err) => {
      res.status(500);
      res.send(utils.Error(500, err.message, undefined));
    });

    if (user) {
      if (user.enable) {
        user.projects.filter((project) => {
          if (project.workspaceId == workspaceId && project.projectId == projectId) {
            // user al
          }
        });
      }
    }
}
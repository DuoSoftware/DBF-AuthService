const UserWorker = require('../workers/user'),
  UserInvitationWorker = require('../workers/userInvitation'),
  ProjectWorker = require('../workers/project'),
  EmailTemplate = require('../services/emailTemplate'),
  MailService = require('../services/mail'),
  cognito = require('../services/cognito'),
  utils = require('../utils');

module.exports.Create = async (req, res) => {
  let inviter = req.user,
    invitee = req.params.to,
    payload = req.body;

  if (!invitee || !utils.HasValidEmail(invitee)) {
    res.status(400);
    res.send(utils.Error("Invitee's email not found or not in correct format.", undefined, 400));
    return;
  }

  try {
    let user = await UserWorker.GetOne({ email: invitee });
    if (user) {
      // already a system user

      // check if requested project is already assigned to invitee
      let assignedProjects = user.projects.filter((project) => {
        return (project.workspaceId == inviter.workspaceId && project.projectId == inviter.projectId);
      });

      if (assignedProjects.length > 0) {
        res.status(400);
        res.send(utils.Error(400, `user(${invitee}) has already been assigned to requested project.`));
      }

      // check user has already been invited to the project.
      let invitation = await UserInvitationWorker.GetOne({ to: invitee, tenant: inviter.workspaceId, company: inviter.projectId, status: 'pending' });
      if (invitation) {
        // pending invitation found.
        res.status(400);
        res.send(utils.Error(400, `user(${invitee}) has already been invited requested project.`));
      }

      let newInvitation = {
        message: "",
        from: inviter.sub,
        to: invitee,
        tenant: inviter.workspaceId,
        company: inviter.projectId,
        attributes: {
          "sender_email": inviter.email,
          "tenant_name": inviter.project.workSpaceName,
          "company_name": inviter.project.projectName
        }
      }
  
      let invitationResponse = await UserInvitationWorker.Create(newInvitation);
      if (invitationResponse) { 
        // invitation created
        // let context = {
        //   inviteeName: "",
        //   inviterName: inviter.family_name,
        //   workspaceName: inviter.project.workSpaceName,
        //   projectName: inviter.project.projectName,
        //   invitationUrl: `https://localhost:1010/dbf/api/v1/invitation/accept/${invitationResponse.id}`
        // };

        // // build invite_existing_user mail template with data
        // let mailTemplate = new EmailTemplate('invite_existing_user').format(context);

        // // create invitaion mail and send
        // let email = new MailService();
        // email.subject(mailTemplate.subject).htmlBody(mailTemplate.html).to(invitee).from(inviter.email);
        // email.send();

        res.status(200);
        res.send(utils.Success(200, `User invitation created.`, {invitationId: invitationResponse.id}));
      } else {
        console.log(invitation.errors);

        res.status(500);
        res.send(utils.Error(400, "Error getting while creating user invitation", undefined));
      }

    } else {
      // not a existing user

      // create password for user
      // let temporaryPassword = utils.GenerateAlphaNumericString(10, true);

      // let newUserObj = {
      //   username: invitee,
      //   temporaryPassword,
      // }

      // // create user in cognito user pool
      // let user = await cognito.CreateUser(newUserObj);
      // console.log(user);

      // res.status(200);
      // res.send(utils.Success(200, `User invitation created.`, {invitationId: invitation.id}));
    }
  } catch (error) {
    res.status(500);
    res.send(utils.Error(400, "Error getting while creating user invitation", undefined));
  }

}

module.exports.Accept = async (req, res) => {
  let invitee = req.user,
    invitationId = req.params.id;

  if (invitationId) {
    let invitation = await UserInvitationWorker.GetOne({ _id: invitationId, to: invitee.email, status: 'pending' });
    if (invitation) {
      let inviteeUpdated = await UserWorker.UpdateOne({
        "userName": invitee.sub,
        "email": invitee.email
      }, {
          $push: {
            workspaces: {
              workspaceId: invitation.tenant,
              workspaceName: invitation.attributes.tenant_name || ""
            },
            projects: {
              projectId: invitation.company,
              projectName: invitation.attributes.company_name || "",
              workspaceId: invitation.tenant
            }
          }
        });

      let projectUpdated = await ProjectWorker.UpdateOne({
        "tenant": invitation.tenant,
        "company": invitation.company,
      }, {
          $push: {
            users: {
              email: invitee.email,
              userId: invitee.sub
            }
          }
        });

      await UserInvitationWorker.UpdateOne({
        _id: invitationId
      }, {
          status: 'accepted'
        });

      res.status(200);
      res.send(utils.Success(200, `User invitation(${invitationId}) accepted.`));
    } else {
      res.status(404);
      res.send(utils.Error(400, "No pending invitation found.", undefined));
    }
  } else {
    res.status(400);
    res.send(utils.Error(400, "Requested invitation id is invalid.", undefined));
  }
}

module.exports.Reject = async (req, res) => {
  let invitee = req.user,
    invitationId = req.params.id;

  if (invitationId) {
    let invitation = await UserInvitationWorker.GetOne({ _id: invitationId, to: invitee.email, status: 'pending' });
    if (invitation) {
      await UserInvitationWorker.UpdateOne({
        _id: invitationId
      }, {
          status: 'rejected'
        });

      res.status(200);
      res.send(utils.Success(200, `User invitation(${invitationId}) rejected.`));
    } else {
      res.status(404);
      res.send(utils.Error(400, "No pending invitation found.", undefined));
    }
  } else {
    res.status(400);
    res.send(utils.Error(400, "Requested invitation id is invalid.", undefined));
  }
}

module.exports.Cancel = (req, res) => { }

module.exports.ListSentInvitations = async (req, res) => {
  let inviter = req.user,
    invitationStatus = req.params.status;

  let context = { from: inviter.sub }
  if (invitationStatus)
    context["status"] = invitationStatus;

  try {
    let invitations = await UserInvitationWorker.Get(context, { 'attributes.temporaryPassword': 0 });

    res.status(200);
    res.send(utils.Success(200, "Successfully fetched sent invitations.", invitations));
  } catch (error) {
    console.log(error);

    res.status(500);
    res.send(utils.Error(500, "Error getting while retrieving sent invitations.", undefined));
  }
}

module.exports.ListReceivedInvitations = async (req, res) => {
  let inviter = req.user,
    invitationStatus = req.params.status;

  let context = { to: inviter.email }
  if (invitationStatus)
    context["status"] = invitationStatus;

  try {
    let invitations = await UserInvitationWorker.Get(context, { 'attributes.temporaryPassword': 0 });

    res.status(200);
    res.send(utils.Success(200, "Successfully fetched received invitations.", invitations));
  } catch (error) {
    console.log(error);

    res.status(500);
    res.send(utils.Error(500, "Error getting while retrieving received invitations.", undefined));
  }
}

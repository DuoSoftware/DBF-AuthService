const restify = require('restify'),
  config = require('config'),
  corsMiddleware = require('restify-cors-middleware'),
  authorization = require('dbf-congnitoauthorizer'),
  workspaceAccessCheck = require('./middleware/workspaceAccessChecker');

const UserInvitationCtrl = require('./controllers/userInvitations'),
  UserAccountCtrl = require('./controllers/userAccount'),
  AccountPermissionCtrl = require('./controllers/accountPermission');

const MongooseConnection = new require('dbf-dbmodels/MongoConnection');
let connection = new MongooseConnection();

const server = restify.createServer({
  name: "Smoothflow Auth Service",
  version: config.Host.version
}, function (req, res) {

});

const cors = corsMiddleware({
  allowHeaders: ['authorization', 'companyInfo']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser({
  mapParams: true
}));
server.use(restify.plugins.bodyParser({
  mapParams: true
}));

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

server.listen(config.Host.port, () => {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/', (req, res) => { res.end(JSON.stringify({
    name: "Smoothflow Auth Service",
    version: config.Host.version
  }));
});

server.post('/dbf/api/:version/invitation/to/:to', authorization(), workspaceAccessCheck(), UserInvitationCtrl.Create);
server.get('/dbf/api/:version/invitation/accept/:id', authorization(), workspaceAccessCheck(), UserInvitationCtrl.Accept);
server.get('/dbf/api/:version/invitation/reject/:id', authorization(), workspaceAccessCheck(), UserInvitationCtrl.Reject);
server.get('/dbf/api/:version/invitations/sent', authorization(), workspaceAccessCheck(), UserInvitationCtrl.ListSentInvitations);
server.get('/dbf/api/:version/invitations/received', authorization(), workspaceAccessCheck(), UserInvitationCtrl.ListReceivedInvitations);

server.post('/dbf/api/:version/setup/useraccount', authorization(), UserAccountCtrl.setup);
server.get('/dbf/api/:version/user/permissions', authorization(), AccountPermissionCtrl.get);
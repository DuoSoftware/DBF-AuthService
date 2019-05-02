module.exports = {
  Host: {
    port: "HOST_PORT",
    version: "HOST_VERSION"
  },
  AWS: {
    accessKey: "SYS_AWS_ACCESSKEY",
    secretKey: "SYS_AWS_SECRETKEY"
  },
  Cognito: {
    region:  "SYS_COGNITO_REGION",
    userpoolId: "SYS_COGNITO_USERPOOLID",
  },
  SES: {
    host: "SYS_SES_HOST",
    port: "SYS_SES_PORT",
    username: "SYS_SES_USERNAME",
    password: "SYS_SES_PASSWORD"
  },
  Mongo: {
    ip:"SYS_MONGO_HOST",
    port:"SYS_MONGO_PORT",
    dbname:"SYS_MONGO_DB",
    password:"SYS_MONGO_PASSWORD",
    user:"SYS_MONGO_USER",
    replicaset :"SYS_MONGO_REPLICASETNAME",
    cloudAtlas: "SYS_MONGO_CLOUDATLAS"
  },
  Services: {
    billingServiceProtocol: "BILLING_PROTOCOL",
    billingServiceHost: "BILLING_HOST",
  }
};

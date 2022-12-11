
module.exports = (app) => {
  const UnauthorizedController = require("./unauthorized.controller.js");
  const UnauthCtrl = new UnauthorizedController();

  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router();

  router.post("/signup", userValidationRules('signup'), validate, UnauthCtrl.signup);
  router.put("/activate_sms", userValidationRules('activate_sms'), validate, UnauthCtrl.verifySMS);
  router.post("/login", userValidationRules('login'), validate, UnauthCtrl.login);
  router.get("/refresh_token", UnauthCtrl.refreshToken);
  router.get("/test", UnauthCtrl.test);

  app.use("/v1", router);
}

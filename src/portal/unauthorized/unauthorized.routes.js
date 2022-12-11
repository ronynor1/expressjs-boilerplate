
module.exports = (app) => {
  const UnauthorizedController = require("./unauthorized.controller.js");
  const UnauthCtrl = new UnauthorizedController();

  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router();

  router.post("/login", userValidationRules('admin_login'), validate, UnauthCtrl.login);
  router.get("/refresh_token", UnauthCtrl.refreshToken);

  app.use("/v1/admin", router);
}

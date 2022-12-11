
module.exports = (app) => {
  const UsersController = require('./users.controller.js')
  const usersCtrl = new UsersController();

  const jwt_mw = require('../../middlewares/jwt-middleware.js')
  const verifyPermission = require('../../middlewares/permissions-middleware.js')
  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router({mergeParams: true});

  router.post("/logout", userValidationRules('logout'), validate, usersCtrl.logout);

  app.use("/v1/users/:users_id", jwt_mw(), router);
}


module.exports = (app) => {
  const TagsController = require('./tags.controller.js')
  const tagsCtrl = new TagsController();

  const jwt_mw = require('../../middlewares/jwt-middleware.js')
  const verifyPermission = require('../../middlewares/permissions-middleware.js')
  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router({mergeParams: true});

  router.get("/", verifyPermission("client_fetch_tags"), tagsCtrl.clientFindAll.bind(tagsCtrl));
  router.get("/:id", verifyPermission("client_fetch_tag"), userValidationRules('fetch_tag'), validate, tagsCtrl.clientFind.bind(tagsCtrl));

  app.use("/v1/users/:users_id/tags", jwt_mw(), router);
}

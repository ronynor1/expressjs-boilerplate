
module.exports = (app) => {
  const TagsController = require('./tags.controller.js')
  const tagsCtrl = new TagsController();

  const jwt_mw = require('../../middlewares/jwt-middleware.js')
  const verifyPermission = require('../../middlewares/permissions-middleware.js')
  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router({mergeParams: true});

  router.get("/", verifyPermission("cms_fetch_tags"), tagsCtrl.CMSfindAll.bind(tagsCtrl));
  router.get("/list", verifyPermission("cms_fetch_tags_list"), tagsCtrl.findAllList.bind(tagsCtrl));
  router.get("/:id", verifyPermission("cms_fetch_tag"), userValidationRules('fetch_tag'), validate, tagsCtrl.CMSfind.bind(tagsCtrl));
  router.post("/", verifyPermission("cms_create_tag"),  userValidationRules('create_tag'), validate, tagsCtrl.create.bind(tagsCtrl));
  router.put("/:id", verifyPermission("cms_update_tag"), userValidationRules('update_tag'), validate, tagsCtrl.update.bind(tagsCtrl));
  router.delete("/:id", verifyPermission("cms_delete_tag"), userValidationRules('delete_tag'), validate, tagsCtrl.delete.bind(tagsCtrl));

  app.use("/v1/admin/:admin_id/tags", jwt_mw(), router);
}

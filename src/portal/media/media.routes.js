
module.exports = (app) => {
  const mediaController = require('./media.controller.js')
  const mediaCtrl = new mediaController();

  const jwt_mw = require('../../middlewares/jwt-middleware.js')
  const verifyPermission = require('../../middlewares/permissions-middleware.js')
  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router({mergeParams: true});

  router.get("/", verifyPermission("cms_fetch_medias"), mediaCtrl.CMSfindAll.bind(mediaCtrl));
  router.get("/list", verifyPermission("cms_fetch_medias_list"), mediaCtrl.findAllList.bind(mediaCtrl));
  router.get("/:id", verifyPermission("cms_fetch_media"), userValidationRules('fetch_media'), validate, mediaCtrl.CMSfind.bind(mediaCtrl));
  router.post("/", verifyPermission("cms_create_media"),  userValidationRules('create_media'), validate, mediaCtrl.create.bind(mediaCtrl));
  router.put("/:id", verifyPermission("cms_update_media"), userValidationRules('update_media'), validate, mediaCtrl.update.bind(mediaCtrl));
  router.delete("/:id", verifyPermission("cms_delete_media"), userValidationRules('delete_media'), validate, mediaCtrl.delete.bind(mediaCtrl));

  app.use("/v1/admin/:admin_id/media", jwt_mw(), router);
}


module.exports = (app) => {
  const ArtistsController = require('./artists.controller.js')
  const artistsCtrl = new ArtistsController();

  const jwt_mw = require('../../middlewares/jwt-middleware.js')
  const verifyPermission = require('../../middlewares/permissions-middleware.js')
  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router({mergeParams: true});

  router.get("/", verifyPermission("cms_fetch_artists"), artistsCtrl.CMSfindAll.bind(artistsCtrl));
  router.get("/list", verifyPermission("cms_fetch_artists_list"), artistsCtrl.findAllList.bind(artistsCtrl));
  router.get("/:id", verifyPermission("cms_fetch_artist"), userValidationRules('fetch_artist'), validate, artistsCtrl.CMSfind.bind(artistsCtrl));
  router.post("/", verifyPermission("cms_create_artist"),  userValidationRules('create_artist'), validate, artistsCtrl.create.bind(artistsCtrl));
  router.put("/:id", verifyPermission("cms_update_artist"), userValidationRules('update_artist'), validate, artistsCtrl.update.bind(artistsCtrl));
  router.delete("/:id", verifyPermission("cms_delete_artist"), userValidationRules('delete_artist'), validate, artistsCtrl.delete.bind(artistsCtrl));

  app.use("/v1/admin/:admin_id/artists", jwt_mw(), router);
}

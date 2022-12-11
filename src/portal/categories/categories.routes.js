
module.exports = (app) => {
  const CategoriesController = require('./categories.controller.js')
  const categoriesCtrl = new CategoriesController();

  const jwt_mw = require('../../middlewares/jwt-middleware.js')
  const verifyPermission = require('../../middlewares/permissions-middleware.js')
  const { validate } = require('../../middlewares/validation-middleware.js')
  const { userValidationRules } = require('./validation.js')

  let router = require("express").Router({mergeParams: true});

  router.get("/", verifyPermission("cms_fetch_categories"), categoriesCtrl.CMSfindAll.bind(categoriesCtrl));
  router.get("/list", verifyPermission("cms_fetch_categories_list"), categoriesCtrl.findAllList.bind(categoriesCtrl));
  router.get("/:id", verifyPermission("cms_fetch_category"), userValidationRules('fetch_category'), validate, categoriesCtrl.CMSfind.bind(categoriesCtrl));
  router.post("/", verifyPermission("cms_create_category"),  userValidationRules('create_category'), validate, categoriesCtrl.create.bind(categoriesCtrl));
  router.put("/:id", verifyPermission("cms_update_category"), userValidationRules('update_category'), validate, categoriesCtrl.update.bind(categoriesCtrl));
  router.delete("/:id", verifyPermission("cms_delete_category"), userValidationRules('delete_category'), validate, categoriesCtrl.delete.bind(categoriesCtrl));

  app.use("/v1/admin/:admin_id/categories", jwt_mw(), router);
}

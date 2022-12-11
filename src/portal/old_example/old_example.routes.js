module.exports = (app) => {
    const tags = require("../controllers/old_example.controller.js");
    const jwt_mw = require('../../middlewares/jwt-middleware.js')
    const verifyPermission = require('../../middlewares/permissions-middleware.js')
    const { userValidationRules, validate } = require('../../middlewares/validation-middleware.js')

    let router = require("express").Router({mergeParams: true});

    router.get("/", verifyPermission("cms_fetch_tags"), tags.CMSfindAll);
    router.get("/:id", verifyPermission("cms_fetch_tag"), tags.CMSfind);
    router.post("/", verifyPermission("cms_create_tag"),  userValidationRules('create_tag'), validate, tags.CMScreate);
    router.put("/:id", verifyPermission("cms_update_tag"), userValidationRules('update_tag'), validate, tags.CMSupdate);
    router.delete("/:id", verifyPermission("cms_delete_tag"), tags.CMSdelete);
  
    app.use("/v1/admin/:admin_id/tags", jwt_mw(), router);
  };
  
module.exports = (app) => {
    const tags = require("../controllers/tags.controller.js");
    const jwt_mw = require('../../middlewares/jwt-middleware.js')
    const verifyPermission = require('../../middlewares/permissions-middleware.js')

    let router = require("express").Router({mergeParams: true});

    router.get("/", verifyPermission("client_fetch_tags"), tags.findAll);
    router.get("/:id", verifyPermission("client_fetch_tag"), tags.find);
  
    app.use("/v1/users/:users_id/tags", jwt_mw(), router);
  };
  
const jwt = require('jsonwebtoken');
const logger = require('../helpers/logger.js')(module);
const { sequelize } = require('../models');
const initModels = require("../models/init-models.js");
let models = initModels(sequelize);

// Catch the incoming request, get the auth header and check if JWT is valid
module.exports = function (options) {
  return async function (req, res, next) {
    try {
      // Fetch header and token from request
      const id = !req.params.users_id ? req.params.admin_id : req.params.users_id;

      let header = req.headers.authorization;
      let token = header && header.split(" ")[1];
      if(token == null) return res.status("401").send();

      let decoded_jwt = jwt.verify(token, process.env.TOKEN_SECRET);

      // Check if id in route = id in JWT
      if (id != decoded_jwt.data) return res.status("401").send();

      // check if token exists in UsersTokens
      const invalid_token = await models.UsersTokens.findOne({where: {users_id: id, token: token} });
      if(invalid_token) return res.status("401").send();

      next();
    } catch(error) {
      logger.error(error.message);
      return res.status(401).json({
        error: "Invalid token"
      });
    }
  };
}

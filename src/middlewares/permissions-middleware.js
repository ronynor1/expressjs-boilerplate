const { sequelize } = require('../models');
const initModels = require("../models/init-models.js");
let models = initModels(sequelize);
const logger = require('../helpers/logger.js')(module);

const verifyPermission = (permission) => {
  return async function (req, res, next) {
    try {
      
      const id = !req.params.users_id ? req.params.admin_id : req.params.users_id;
      const result = await models.AuthRolesPermissions.findOne({
        include: [{
          model: models.AuthPermissions,
          as: 'permission',
          where: {action: permission, method: req.method},
          required: true
        },{
          model: models.AuthRoles,
          as: 'role',
          required: true,
          include: [{
            model: models.Users,
            as: 'users',
            where: {id: id, removed: false},
            required: true
          }]
        }]
      });

      if(result) { 
        next();
        return;
      }

      return res.status(401).json({
        error: "Permission Denied"
      });

    } catch(error){
      logger.error(error.message);
      return res.status(401).json({
        error: "Permission Denied"
      });
    }
  };

}

module.exports = verifyPermission;

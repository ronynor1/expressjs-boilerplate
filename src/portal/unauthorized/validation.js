
const { param, body } = require('express-validator')
const { sequelize } = require('../../models');
const constants = require('../../config/constants');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'admin_login':
      return [
        body('phone_number').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS).custom( async value => {
          const user = await models.Users.findOne({
            where: {phone_number: value},
            include: [{
              model: models.AuthRoles,
              as: 'role',
              where: {key: 'ADMIN_ROLE'},
              required: true
            }]
          });
          if(!user)
          {
            throw Error(constants.WRONG_CREDENTIALS);
          }
        }),
        body('password').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS)
      ];
  }
}

module.exports = { userValidationRules }

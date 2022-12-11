
const { param, body } = require('express-validator')
const { sequelize } = require('../../models');
const constants = require('../../config/constants');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'logout':
      return [
        body('accessToken').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('refreshToken').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS)
      ];
  }
}

module.exports = { userValidationRules }

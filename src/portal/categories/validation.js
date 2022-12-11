
const { param, body } = require('express-validator')
const constants = require('../../config/constants');
const { sequelize } = require('../../models');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'fetch_category':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value, removed: false} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
    case 'create_category':
      return [
        body('key').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS)
      ];
    case 'update_category':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value, removed: false} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
    case 'delete_category':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
  }
}

module.exports = { userValidationRules }

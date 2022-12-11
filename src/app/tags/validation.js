
const { param, body } = require('express-validator')
const { sequelize } = require('../../models');
const initModels = require("../../models/init-models.js");
const constants = require('../../config/constants');
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'fetch_tag':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const tag = await models.Tags.findOne({ where: {id: value, removed: false} });
          if(!tag)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
  }
}

module.exports = { userValidationRules }

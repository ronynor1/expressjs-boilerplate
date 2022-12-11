
const { param, body } = require('express-validator')
const constants = require('../../config/constants');
const { sequelize } = require('../../models');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'create_artist':
      return [
        body('artists_langinfos').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('artists_langinfos.*.full_name').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('artists_langinfos.*.language').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
      ];
    case 'update_artist':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const artist = await models.Artists.findOne({ where: {id: value, removed: false} });
          if(!artist)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];  
    case 'delete_artist':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const artist = await models.Artists.findOne({ where: {id: value} });
          if(!artist)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
    case 'fetch_artist':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const artist = await models.Artists.findOne({ where: {id: value, removed: false} });
          if(!artist)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
  }
}

module.exports = { userValidationRules }

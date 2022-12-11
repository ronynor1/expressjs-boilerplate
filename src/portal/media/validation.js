
const { param, body } = require('express-validator')
const constants = require('../../config/constants');
const { sequelize } = require('../../models');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'fetch_media':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const media = await models.Media.findOne({ where: {id: value, removed: false} });
          if(!media)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
    case 'create_media':
      return [
        body('artists_obj').exists({checkFalsy:true}).withMessage(constants.NOT_FOUND).custom( async value => {
          const artist = await models.Artists.findOne({ where: {id: value} });
          if(!artist)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
        body('categories_obj').exists({checkFalsy:true}).withMessage(constants.NOT_FOUND).custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
        body('name').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
      ];
    case 'update_media':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const media = await models.Media.findOne({ where: {id: value, removed: false} });
          if(!media)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
        body('artists_obj').optional().custom( async value => {
          const artist = await models.Artists.findOne({ where: {id: value} });
          if(!artist)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
        body('categories_obj').optional().custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        })
      ];  
    case 'delete_media':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const media = await models.Media.findOne({ where: {id: value} });
          if(!media)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
  }
}

module.exports = { userValidationRules }

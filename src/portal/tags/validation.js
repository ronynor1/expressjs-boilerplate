
const { param, body } = require('express-validator')
const constants = require('../../config/constants');
const { sequelize } = require('../../models');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'create_tag':
      return [
        body('key').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('type').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('tags_langinfos').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('tags_langinfos.*.title').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('tags_langinfos.*.language').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('tags_categories.*.categories_id').optional().custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
    case 'update_tag':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const tag = await models.Tags.findOne({ where: {id: value, removed: false} });
          if(!tag)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
        body('tags_categories.*.categories_id').optional().custom( async value => {
          const category = await models.Categories.findOne({ where: {id: value} });
          if(!category)
          {
            throw Error(constants.NOT_FOUND);
          }
        })
      ];
    case 'delete_tag':
      return [
        param('id').exists({checkFalsy:true}).custom( async value => {
          const tag = await models.Tags.findOne({ where: {id: value} });
          if(!tag)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
      ];
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

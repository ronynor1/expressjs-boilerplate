
const { param, body } = require('express-validator')
const { sequelize } = require('../../models');
const constants = require('../../config/constants');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// validate body of requests
const userValidationRules = (method) => {
  switch (method)
  {
    case 'signup':
      return [
        body('full_name').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('phone_number').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS).custom( async value => {
          const user = await models.Users.findOne({ where: {phone_number: value.replace(/ /g,'')} });
          if(user)
          {
            throw Error(constants.ALREADY_EXISTS);
          }
        }),
        body('dob').exists({checkFalsy:true}).toDate().withMessage(constants.MISSING_REQUIRED_FIELDS),
        body('password').exists({checkFalsy:true}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+-={}|;:'",./<>?])[A-Za-z\d~!@#$%^&*()_+-={}|;:'",./<>?]{8,}$/).withMessage('password must have: minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'),
        body('confirm_password').exists({checkFalsy:true}).custom((value, { req }) => {
          if (value !== req.body.password) {
            throw Error(constants.PASSWORD_NOT_MATCH);
          }
      
          return true;
        }),
        body('email').optional().isEmail().withMessage(constants.INVALID_EMAIL)
      ];
    case 'activate_sms':
      return [
        body('phone_number').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS).custom( async value => {
          const user = await models.Users.findOne({ where: {phone_number: value.replace(/ /g,'')} });
          if(!user)
          {
            throw Error(constants.NOT_FOUND);
          }
        }),
        body('code').exists({checkFalsy:true}).withMessage(constants.NOT_FOUND)
      ];
    case 'login':
      return [
        body('phone_number').exists({checkFalsy:true}).withMessage(constants.MISSING_REQUIRED_FIELDS).custom( async value => {
          const user = await models.Users.findOne({
            where: {phone_number: value.replace(/ /g,'')},
            include: [{
              model: models.AuthRoles,
              as: 'role',
              where: {key: 'USER_ROLE'},
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

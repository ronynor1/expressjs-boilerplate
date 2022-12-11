const error_codes = require('../config/error-codes')

const { validationResult } = require('express-validator')

// check if request has some errors
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty())
  {
    next({status: error_codes[errors['errors'][0].msg]?.status, code: error_codes[errors['errors'][0].msg]?.code})
  }
  next();
}

module.exports = { validate }

const UnauthorizedService = require('./unauthorized.service.js');
const error_codes = require('../../config/error-codes');

class UnauthorizedController
{
  async login(req, res, next) {
    
    try {

      const result = await UnauthorizedService.login(req.body);
      return res.status(201).json(result);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }

  async refreshToken(req, res, next) {
    
    try {

      const result = await UnauthorizedService.refreshToken(req.headers);
      return res.status(201).json(result);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }

}

module.exports = UnauthorizedController;

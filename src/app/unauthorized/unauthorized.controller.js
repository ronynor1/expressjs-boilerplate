const header_language = require("../../helpers/header_language.js");
const UnauthorizedService = require('./unauthorized.service.js');
const error_codes = require('../../config/error-codes');

class UnauthorizedController
{
  // signup
  async signup(req, res, next) {
  
    try {

      await UnauthorizedService.signup(req.body);
      return res.status(201).send();

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }
  
  async verifySMS (req, res, next) {
  
    try {

      const result = await UnauthorizedService.verifySMS(req.body);
      return res.status(201).json(result);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }
  
  async login(req, res, next) {
  
    try {

      const result = await UnauthorizedService.login(req.body);
      return res.status(201).json(result);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }
  
  // generate token from refresh_token
  async refreshToken(req, res, next) {
  
    try {

      const result = await UnauthorizedService.refreshToken(req.headers);
      return res.status(201).json(result);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }
  
  async test(req, res, next) {
  
    try {

      const lang = header_language.match(req);

      const results = await UnauthorizedService.test(lang);
      return res.status(201).json(results);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }

}

module.exports = UnauthorizedController;

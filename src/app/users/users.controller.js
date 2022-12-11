const UsersService = require('./users.service.js');
const error_codes = require('../../config/error-codes');

const { sequelize } = require('../../models');
const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

const BaseController = require('../base/base.controller.js');

class UsersController extends BaseController {

  constructor() {
      super();
      this._model = models.Users;
      this._search = ['full_name','email'];
      this._order = ['id','DESC'];
  }

  // store tokens in db
  async logout(req, res, next) {

    try {

      const id = req.params.users_id;

      await UsersService.logout(models, id, req.body);
      return res.status(201).send();

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }

  }

}

module.exports = UsersController;

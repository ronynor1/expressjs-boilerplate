const header_language = require("../../helpers/header_language.js");
const BaseService = require('./base.service.js');
const error_codes = require('../../config/error-codes');

class BaseController {

  constructor(model, search, order, title, delete_constrainsts=[], dropdown_objs=[], oneToManyModel=null, manyToManyModels=[]) {
    this._model = model; // name of the main model
    this._search = search; // search columns in array
    this._title = title; // choose title for list
    this._order = order; // order by
    this._delete_constrainsts = delete_constrainsts; // array models for delete constraints
    this._dropdown_objs = dropdown_objs; // add dropdown objs for fetch details, create and update
    this._oneToManyModel = oneToManyModel; // one object that contains the langinfo model (see example)
    this._manyToManyModels = manyToManyModels; // array of objects that contains manToMany models (see example)
  }

  // find all
  async CMSfindAll(req, res, next) {

    try {

      const lang = header_language.match(req);

      const results = await BaseService.CMSfindAll(this, req.query, lang);
      return res.status(200).json(results);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }

  }

  // find all list
  async findAllList(req, res, next) {

    try {

      const lang = header_language.match(req);

      const results = await BaseService.findAllList(this, lang);
      return res.status(200).json(results);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }

  }

  // find
  async CMSfind (req, res, next) {

    try {

      const lang = header_language.match(req);
      const id = req.params.id;

      const result = await BaseService.CMSfind(this, id, lang);
      return res.status(200).json(result);

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }

  }

  // create
  async create (req, res, next) {

    try {

      const id = await BaseService.create(this, req.body);
      return res.status(200).send({'created_id': id});

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }
  }

  // update
  async update (req, res, next) {
    
    try {

      const id = req.params.id;

      await BaseService.update(this, id, req.body);
      return res.status(200).send();

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }

  }

  // delete
  async delete (req, res, next) {

    try {

      const id = req.params.id;

      await BaseService.delete(this, id);
      return res.status(200).send();

    } catch (error) {
      next({status: error_codes[error.message]?.status, code: error_codes[error.message]?.code})
    }

  }

}

module.exports = BaseController;
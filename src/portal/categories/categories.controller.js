const { sequelize } = require('../../models');

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

const BaseController = require('../base/base.controller.js');

class CategoriesController extends BaseController {

    constructor() {
        super();
        this._model = models.Categories;
        this._search = ['key'];
        this._title = 'key';
        this._order = ['id','DESC'];
    }

}

module.exports = CategoriesController;

const { sequelize } = require('../../models');

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

const BaseController = require('../base/base.controller.js');

class TagsController extends BaseController {
    
    constructor() {
        super();
        this._model = models.Tags;
        this._search = ['key','type'];
        this._order = ['id','DESC'];
        this._oneToManyModel = {model: models.TagsLanginfo, alias: 'tags_langinfos', search: ['title'], title: 'title'};
        this._manyToManyModels = [{create_model: models.TagsCategories, create_alias: 'tags_categories', fetch_model: models.Categories, fetch_alias: 'categories_id_categories'}];
    }

}

module.exports = TagsController;

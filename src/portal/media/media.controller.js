const { sequelize } = require('../../models');

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

const BaseController = require('../base/base.controller.js');

class MediaController extends BaseController {

    constructor() {
        super();
        this._model = models.Media;
        this._search = ['name'];
        this._title = 'name';
        this._order = ['id','DESC'];
        this._dropdown_objs = [
            {model: models.Categories, old_key: 'categories_id', key: 'categories_obj', title: 'key'},
            {model: models.Artists, title_model: models.ArtistsLanginfo, alias: 'artists_langinfos', old_key: 'artists_id', key: 'artists_obj', title: 'full_name'}
        ];
    }

}

module.exports = MediaController;

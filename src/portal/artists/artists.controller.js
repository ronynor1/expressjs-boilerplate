const { sequelize } = require('../../models');

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

const BaseController = require('../base/base.controller.js');

class ArtistsController extends BaseController {

    constructor() {
        super();
        this._model = models.Artists;
        this._search = [];
        this._order = ['id','DESC'];
        this._oneToManyModel = {model: models.ArtistsLanginfo, alias: 'artists_langinfos', search: ['full_name'], title: 'full_name'};
    }

}

module.exports = ArtistsController;

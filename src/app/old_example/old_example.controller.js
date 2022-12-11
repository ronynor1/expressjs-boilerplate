const { Sequelize, sequelize } = require('../../models');
const paginator = require("../../helpers/paginator");
const header_language = require("../../helpers/header_language.js");
const logger = require('../../helpers/logger.js')(module);

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// find all tags
exports.findAll = async (req, res) => {

  try {

    // get language from helper
    const lang = header_language.match(req);
    // get Op object from Sequelize
    const Op = Sequelize.Op;

    // Get filter
    let filter = req.query.filter;
    if(typeof filter === 'undefined')
      filter = '';

    // Pagination settings
    const { page, size } = req.query; // Query params
    const { limit, offset } = paginator.getPagination(page, size); // Pagination values

    // find all tags + include tags_langinfo + include ManyToMany Categories with pagination
    // put required true in tags_langinfo to get only the records with a language
    const tags = await models.Tags.findAndCountAll(
      {
        attributes: ['id','key','type'],
        where: {
          removed: false,
          [Op.or]:[
            {'key': { [Op.like]: '%' + filter + '%' } },
            {'type': { [Op.like]: '%' + filter + '%' } }
          ]
        },
        include: [{
          model: models.TagsLanginfo,
          as: 'tags_langinfos',
          attributes: ['id','title','language'],
          where: {language: lang},
          required: true
        },{
          model: models.Categories,
          as: 'categories_id_categories',
          attributes: ['id','key'],
          through: { attributes: [] }
        }],
        limit: limit,
        offset: offset
    });

    const response = paginator.getPagingData(tags, page, limit);

    return res.json(response);

  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: error.message });
  }

};

// find tag
exports.find = async (req, res) => {

  // get language from helper
  const lang = header_language.match(req);
  const id = req.params.id;

  try {

    // find a tag + include tags_langinfo + include ManyToMany Categories
    const tag = await models.Tags.findOne({
      where: {id:id, removed:false},
      include: [{
        model: models.TagsLanginfo,
        as: 'tags_langinfos',
        attributes: ['id','title','language'],
        where: {language: lang},
        required: true
      },{
        model: models.Categories,
        as: 'categories_id_categories',
        attributes: ['id','key'],
        through: { attributes: [] }
      }],
    });

    return res.json(tag);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json(error);
  }

};

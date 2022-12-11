const { Sequelize, sequelize } = require('../../models');
const paginator = require("../../helpers/paginator");
const header_language = require("../../helpers/header_language.js");
const logger = require('../../helpers/logger.js')(module);

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// find all tags
exports.CMSfindAll = async (req, res) => {

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
    // put required false in tags_langinfo to get all records even though there are no languages 
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
          required: false
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
exports.CMSfind = async (req, res) => {

  // get language from helper
  const lang = header_language.match(req);
  const id = req.params.id;

  try {

    // find a tag + include tags_langinfo + include ManyToMany Categories
    // put required false in tags_langinfo to get all records even though there are no languages 
    const tag = await models.Tags.findOne({
      where: {id:id, removed:false},
      include: [{
        model: models.TagsLanginfo,
        as: 'tags_langinfos',
        attributes: ['id','title','language'],
        where: {language: lang},
        required: false
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

// Create Tags
exports.CMScreate = async (req, res) => {

  try {

    // to create tags, make sure to set in the body the right name of the objects
    await models.Tags.create(req.body,
      {
        include: [
          {model: models.TagsLanginfo, as: 'tags_langinfos'},
          {model: models.TagsCategories, as: 'tags_categories'}
        ]
      }
    );

    return res.status(201).send({ message: "created" });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: error.message });
  }
};

// Update Tags
exports.CMSupdate = async (req, res) => {
  // Validate request
  if (isEmpty(req.body))
    return res.status(400).send({
      message: "Content can not be empty!",
    });

  const id = req.params.id
  // add id to body to update this record
  req.body['id'] = id;

  try {

    // build tags and then save it
    let tags = models.Tags.build(req.body, {isNewRecord : false});
    await tags.save();
    
    // loop through body, check if there is an object, if yes, create/update by comparing language
    if(req.body['tags_langinfos'].length > 0)
    {
      for(const object of req.body['tags_langinfos'])
      {
        if(object.language)
        {
          // find tags_langinfo; if true, update it, else create record in langinfo
          const tags_langinfo_model = await models.TagsLanginfo.findOne({where: {tags_id:id, language:object.language}});
      
          if(tags_langinfo_model){
            // add/update all key values + update the data object
            const tags_langinfo_body = Object.assign(tags_langinfo_model.toJSON(), object);
            // build tags_langinfo with new body and save it
            let tags_langinfo = models.TagsLanginfo.build(tags_langinfo_body, {isNewRecord : false});
            await tags_langinfo.save();
          }
          else{
            // add tags_id to body and create record
            const tags_langinfo_body = Object.assign(object, {'tags_id': id});
            await models.TagsLanginfo.create(tags_langinfo_body);
          }
        }
      }
    }

    // delete all manytomany then create them, if an error occurs, revert any change
    try{
      await sequelize.transaction(async t => {

        // destroy all records where tags_id is given
        await models.TagsCategories.destroy({ where: { tags_id:id}, transaction: t });
        // add tags_id in all objects
        const tags_categories_body = req.body['tags_categories'].map(v => ({...v, tags_id:id,}));
        // use bulkCreate and pass the edited body to insert all records
        await models.TagsCategories.bulkCreate(tags_categories_body, { transaction: t });

      });
    }catch(error){}

    return res.status(200).send({ message: "updated" });
    
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: error.message });
  }

};

// Delete Tags
exports.CMSdelete = async (req, res) => {

  const id = req.params.id

  try {

    // find the tag
    const tag = await models.Tags.findOne({ where: {id} });

    // set removed 1
    tag.removed = 1;

    // update it in db
    await tag.save();

    return res.status(200).send({ message: "deleted" });
    
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: error.message });
  }

};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

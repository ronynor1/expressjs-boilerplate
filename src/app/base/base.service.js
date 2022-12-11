const { Sequelize, sequelize } = require('../../models');
const paginator = require("../../helpers/paginator");
const { renameKey, isEmpty } = require("../../helpers/functions.js");
const error_codes = require('../../config/error-codes');
const constants = require('../../config/constants');
const logger = require('../../helpers/logger.js')(module);

// find all
exports.clientFindAll = async function (context, req_query, lang) {

  try {

    // get Op object from Sequelize
    const Op = Sequelize.Op;

    // Get filter
    let filter = req_query.filter;
    if(typeof filter === 'undefined')
      filter = '';

    // Pagination settings
    const { page, size } = req_query; // Query params
    const { limit, offset } = paginator.getPagination(page, size); // Pagination values

    // prepare options_obj to pass it to sequelize findAndCountAll function
    let options_obj = {};
    options_obj['where'] = {};

    // if there are search columns, add them to the options_obj
    if(context._search.length > 0)
    {
      // include the basic where condition with search
      options_obj['where'] = {
        [Op.or]: context._search.map(key => ({
          [key]: {
            [Op.like]: [`%${filter}%`]
          }
        }))
      };
    }

    // include the basic where condition
    options_obj['where']['removed'] = false;

    options_obj['limit'] = limit;
    options_obj['offset'] = offset;
    options_obj['distinct'] = true; // put this to correct the count of findAndCountAll function (usually shows if there are manyToMany relations)
    // options_obj['col'] = 'id'; enable this if something went wrong with the count of findAndCountAll function 
    options_obj['order'] = [
      context._order
    ];

    let array = [];
    // if there is a langinfo object, create the include object and add it to the sequelize fetch function
    if(context._oneToManyModel)
    {
      // prepare the options_obj for langinfo
      let language_options_obj = {};
      language_options_obj['model'] = context._oneToManyModel.model;
      language_options_obj['as'] = context._oneToManyModel.alias;

      // initialize search_langinfo_obj
      let search_langinfo_obj = {};

      // if there are search columns, add them to the language_options_obj
      if(context._oneToManyModel.search.length > 0)
      {
        // search langinfo
        search_langinfo_obj = {
          [Op.or]: context._oneToManyModel.search.map(key => ({
            [key]: {
              [Op.like]: [`%${filter}%`]
            }
          }))
        };
      }

      // do not return null rows 
      language_options_obj['required'] = true;

      // add language to the where condition
      search_langinfo_obj['language'] = lang;

      // include where condition
      language_options_obj['where'] = search_langinfo_obj;

      // create the include object
      array.push(language_options_obj);
    }

    // if there are manyToMany objects, create the include object and add them to the sequelize fetch function
    for(const obj of context._manyToManyModels)
    {
      array.push({model: obj.fetch_model, as: obj.fetch_alias, through: {attributes: []} });
    }

    options_obj['include'] = array;

    // find all
    const results = await context._model.findAndCountAll(options_obj);

    let response = paginator.getPagingData(results, page, limit);

    // change manyToMany key like create key
    if(context._manyToManyModels)
    {
      response = JSON.stringify(response);
      for(const mtmModel of context._manyToManyModels)
      {
        response = response.replaceAll(mtmModel.fetch_alias, mtmModel.create_alias);
      }
      response = JSON.parse(response);
    }

    return response;

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }

}

// find all list
exports.findAllList = async function (context, lang) {

  try {

    // prepare options_obj to pass it to sequelize findAndCountAll function
    let options_obj = {};
    options_obj['where'] = {};

    // include the basic where condition
    options_obj['where']['removed'] = false;

    options_obj['distinct'] = true; // put this to correct the count of findAndCountAll function (usually shows if there are manyToMany relations)
    // options_obj['col'] = 'id'; enable this if something went wrong with the count of findAndCountAll function 
    options_obj['order'] = [
      ['id', 'DESC']
    ];

    let attributes = [];
    attributes.push(['id', 'value']);
    if(context._title)
    {
      attributes.push([context._title, 'title']);
    }

    let array = [];
    // if there is a langinfo object, create the include object and add it to the sequelize fetch function
    if(context._oneToManyModel)
    {
      // prepare the options_obj for langinfo
      let language_options_obj = {};
      language_options_obj['model'] = context._oneToManyModel.model;
      language_options_obj['as'] = context._oneToManyModel.alias;

      // initialize search_langinfo_obj
      let search_langinfo_obj = {};

      language_options_obj['required'] = true;

      // add language to the where condition
      search_langinfo_obj['language'] = lang;

      // include where condition
      language_options_obj['where'] = search_langinfo_obj;

      let language_attributes = [];
      if(context._oneToManyModel.title)
      {
        language_attributes.push([context._oneToManyModel.title, 'title']);
      }
      language_options_obj['attributes'] = language_attributes;

      // create the include object
      array.push(language_options_obj);
    }

    options_obj['include'] = array;

    options_obj['attributes'] = attributes;
    options_obj['raw'] = true;

    // find all
    const results = await context._model.findAll(options_obj);

    if(context._oneToManyModel && !context._title)
    {
      results.forEach( obj => renameKey( obj, context._oneToManyModel.alias+'.title', 'title' ) );
    }

    return results;

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }

}

// find
exports.clientFind = async function(context, id, lang) {

  try {

    let options_obj = {};
    let array = [];

    // include the basic where condition
    options_obj['where'] = {id:id, removed: false};

    // if there is a langinfo object, create the include object and add it to the sequelize fetch function
    if(context._oneToManyModel)
    {
      array.push({model: context._oneToManyModel.model, as: context._oneToManyModel.alias, where: {language: lang}, required: true });
    }

    // if there are manyToMany objects, create the include object and add them to the sequelize fetch function
    for(const obj of context._manyToManyModels)
    {
      array.push({model: obj.fetch_model, as: obj.fetch_alias, through: {attributes: []} });
    }

    options_obj['include'] = array;

    // add _obj foreach _id for dropdowns
    for(const obj of context._dropdown_objs)
    {
      let array = [];
      let obj_options = {};
      // include the basic where condition
      obj_options['where'] = {id:result[obj.old_key], removed: false};

      let obj_attributes = [];
      // change id to value
      obj_attributes.push(['id', 'value']);

      // if title is found in langinfo
      if(obj.title_model)
      {
        // prepare the options_obj for langinfo
        let language_options_obj = {};
        language_options_obj['model'] = obj.title_model;
        language_options_obj['as'] = obj.alias;

        language_options_obj['required'] = true;
        // add where condition
        let condition_langinfo_obj = {};
        condition_langinfo_obj[obj.old_key] = result.getDataValue(obj.old_key);
        condition_langinfo_obj['language'] = lang;
        language_options_obj['where'] = condition_langinfo_obj;

        // add title to _obj
        let language_attributes = [];
        language_attributes.push([obj.title, 'title']);
        language_options_obj['attributes'] = language_attributes;

        // create the include object
        array.push(language_options_obj);
      }
      else
      {
        // if title is not in langinfo
        obj_attributes.push([obj.title, 'title']);
      }

      obj_options['include'] = array;

      obj_options['attributes'] = obj_attributes;
      obj_options['raw'] = true;

      result.setDataValue(obj.key, await obj.model.findOne(obj_options));
    }

    // change modelName.title to title if there is langinfo
    for(const object of context._dropdown_objs)
    {
      if(object.alias)
      {
        renameKey( result.getDataValue(object.key), object.alias+'.title', 'title' );
      }
    }
    
    // find one
    let result = await context._model.findOne(options_obj);

    // change manyToMany key like create key
    if(context._manyToManyModels)
    {
      result = JSON.stringify(result);
      for(const mtmModel of context._manyToManyModels)
      {
        result = result.replaceAll(mtmModel.fetch_alias, mtmModel.create_alias);
      }
      result = JSON.parse(result);
    }

    return result;

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }

};

// create
exports.create = async function (context, req_body) {

  try {

    // add _obj foreach _id for dropdowns
    for(const obj of context._dropdown_objs)
    {
      renameKey( req_body, obj.key, obj.old_key );
    }

    delete req_body['removed'];

    // if there is a langinfo object, create the options object and add it to the sequelize create function
    let options_obj = {};
    let array = [];
    if(context._oneToManyModel)
    {
      array.push({model: context._oneToManyModel.model, as: context._oneToManyModel.alias});
    }

    // if there are manyToMany objects, create the options object and add them to the sequelize create function
    for(const obj of context._manyToManyModels)
    {
      array.push({model: obj.create_model, as: obj.create_alias});
    }

    // add everything to 'include'
    options_obj = {
      include: array
    };

    // create
    const result = await context._model.create(req_body, options_obj);

    return result.id;

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }
}

// update
exports.update = async function (context, id, req_body) {
    
  try {

    // Validate request
    if (isEmpty(req_body))
      throw Error(constants.NOT_FOUND)

    // add _obj foreach _id for dropdowns
    for(const obj of context._dropdown_objs)
    {
      if(req_body[obj.key])
      {
        renameKey( req_body, obj.key, obj.old_key );
      }
    }

    delete req_body['removed'];
    
    // add id to body to update this record
    req_body['id'] = id;

    // build tags and then save it
    let object = context._model.build(req_body, {isNewRecord : false});
    await object.save();

    // get table name in small case
    let table_id = context._model.tableName+'_id';

    // check if there is a langinfo object
    if(context._oneToManyModel)
    {
      // loop through body, check if there is an object, if yes, create/update by comparing language
      if(req_body[context._oneToManyModel.alias].length > 0)
      {
        for(const object of req_body[context._oneToManyModel.alias])
        {
          if(object.language)
          {
            // find langinfo; if true, update it, else create record in langinfo
            const langinfo_model = await context._oneToManyModel.model.findOne({where: {[table_id]:id, language:object.language}});
        
            if(langinfo_model){
              // add/update all key values + update the data object
              const langinfo_body = Object.assign(langinfo_model.toJSON(), object);
              // build langinfo with new body and save it
              let langinfo = context._oneToManyModel.model.build(langinfo_body, {isNewRecord : false});
              await langinfo.save();
            }
            else{
              // add _id to body and create record
              const langinfo_body = Object.assign(object, {[table_id]: id});
              await context._oneToManyModel.model.create(langinfo_body);
            }
          }
        }
      }
    }

    // loop through each manyTomany model
    for(const obj of context._manyToManyModels)
    {
      // delete all manytomany then create them, if an error occurs, revert any change
      try{
        await sequelize.transaction(async t => {

          // destroy all records where table_id is given
          await obj.create_model.destroy({ where: { [table_id]:id}, transaction: t });
          // add table_id in all objects
          const many_to_many_body = req_body[obj.create_alias].map(v => ({...v, [table_id]:id,}));
          // use bulkCreate and pass the edited body to insert all records
          await obj.create_model.bulkCreate(many_to_many_body, { transaction: t });

        });
      }catch(error){}
    }

    return true;
    
  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }

}

// delete
exports.delete = async function (context, id) {

  try {

    let include_array = [];

    // for already exists, it should stay 0 in for loop
    let count = 0;

    // loop through each manyTomany model
    for(const obj of context._delete_constrainsts)
    {
      include_array.push({
        model: obj.model,
        as: obj.alias,
        where: {removed: false},
        required: false
      })
    }

    // find object
    const object = await context._model.findOne({ where: {id}, include: include_array });

    for(const obj of context._delete_constrainsts)
    {
      if(object.getDataValue(obj.alias).length > 0)
        count++;
    }

    if(count != 0)
      throw Error(constants.ALREADY_IN_USE);
    
    // set removed 1
    object.removed = 1;

    // update it in db
    await object.save();

    return true;
    
  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }

}

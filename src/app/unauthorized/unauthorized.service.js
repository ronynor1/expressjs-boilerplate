const { sequelize } = require('../../models');
const { generateRandomString, generateRandomNumber } = require("../../helpers/functions.js");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendWhatsappMessage } = require("../../helpers/wati_message.js");
const error_codes = require('../../config/error-codes');
const constants = require('../../config/constants');
const logger = require('../../helpers/logger.js')(module);

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// signup
exports.signup = async function (req_body) {

  try {

    // remove spaces from phone_number
    req_body.phone_number = req_body.phone_number.replace(/ /g,'');
    // cast dob 
    req_body.dob = req_body.dob.toISOString().slice(0, 19).replace('T', ' ');
    req_body.activate_token = generateRandomString(50);
    req_body.verification_code = generateRandomNumber(4);

    // create hash and add enc_password to body
    req_body.enc_password = await bcrypt.hash(req_body.password, 10); // it creates salt and hashed

    delete req_body.password;
    delete req_body.confirm_password;

    // get USER_ROLE id and add it to body
    const role = await models.AuthRoles.findOne({ where: {key: 'USER_ROLE'} });
    req_body.roles_id = role.getDataValue('id');

    // create user
    let user = await models.Users.create(req_body);
    // build generated_id using id of created user
    user.generated_id = req_body.full_name.toLowerCase().replace(/ /g,'') + user.getDataValue('id');
    // update user
    await user.save();

    return true;

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }
}

exports.verifySMS = async function (req_body) {
  
  try {

    let user = await models.Users.findOne({ where:{phone_number: req_body.phone_number.replace(/ /g,'')} })
    if(user.getDataValue('verification_code') != req_body.code)
    {
      throw Error(constants.INVALID_VERIFICATION_CODE);
    }

    // update user
    user.activate_token = 1;
    user.verification_code = null;
    await user.save();

    // create jwt token
    const token = jwt.sign({data: user.getDataValue('id')}, process.env.TOKEN_SECRET, { expiresIn: '24h' }); // 1800s -> 30mins
    const refresh_token = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '168h', audience: user.getDataValue('id').toString() }); // 1 week
    return {id: user.getDataValue('id'), accessToken: token, refreshToken: refresh_token};

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }
}

exports.login = async function(req_body) {
  
  try {

    const user_obj = await models.Users.findOne({ where:{phone_number: req_body.phone_number.replace(/ /g,'')} })
    
    if(!user_obj)
      throw Error(constants.NOT_FOUND);

    const valid = await bcrypt.compare(req_body.password, user_obj.enc_password);
    if(!valid)
      throw Error(constants.WRONG_CREDENTIALS); // 401
    
    // create jwt token
    const token = jwt.sign({data: user_obj.getDataValue('id')}, process.env.TOKEN_SECRET, { expiresIn: '24h' }); // 1800s -> 30mins
    const refresh_token = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '168h', audience: user_obj.getDataValue('id').toString() }); // 1 week
    return {id: user_obj.getDataValue('id'), accessToken: token, refreshToken: refresh_token};
    
  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }
}

// generate token from refresh_token
exports.refreshToken = async function(req_headers) {
  
  try {

    let header = req_headers.authorization;

    if(!header)
      throw Error(constants.NOT_FOUND);

    // get id from aud from decoded_jwt
    let decoded_jwt = jwt.verify(header, process.env.REFRESH_TOKEN_SECRET);

    // fetch token, if exists return 400
    const userToken = await models.UsersTokens.findOne({where: {users_id:decoded_jwt.aud, token:header} });

    if(userToken)
      throw Error(constants.TOKEN_REVOKED);

    // insert refresh token in db
    await models.UsersTokens.create({"users_id": decoded_jwt.aud, "token": header});

    // create jwt token
    const token = jwt.sign({data: decoded_jwt.aud}, process.env.TOKEN_SECRET, { expiresIn: '24h' }); // 1800s -> 30mins

    return {id: decoded_jwt.aud, accessToken: token};
    
  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }
}

exports.test = async function(lang) {
  
  try {

    // sendWhatsappMessage('96176357057', 'Welcome Back, AlTabshe');

    const [results]  = await sequelize.query(`
      SELECT tags.id, tags.key, tags_langinfo.title
      FROM tags LEFT JOIN tags_langinfo ON tags_langinfo.tags_id = tags.id
      WHERE tags.removed = ? and tags_langinfo.language = ?`,
    {
      replacements: [0, lang]
    });

    return results;

  } catch (error) {
    if(error_codes[error.message] === undefined )
      logger.error(error.message);
    throw Error(error.message);
  }
}

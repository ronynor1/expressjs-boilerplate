const { sequelize } = require('../../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const error_codes = require('../../config/error-codes');
const constants = require('../../config/constants');
const logger = require('../../helpers/logger.js')(module);

const initModels = require("../../models/init-models.js");
let models = initModels(sequelize);

// admin login
exports.login = async (req_body) => {

  try {

    const user_obj = await models.Users.findOne({ where:{phone_number: req_body.phone_number.replace(/ /g,'')} })
    
    if(!user_obj)
      throw Error(constants.NOT_FOUND); // 401

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
exports.refreshToken = async (req_headers) => {

  try {

    let header = req_headers.authorization;

    if(!header)
      throw Error(constants.NOT_FOUND); // 400
    
    // get id from aud from decoded_jwt
    let decoded_jwt = jwt.verify(header, process.env.REFRESH_TOKEN_SECRET);

    // fetch token, if exists return 400
    const userToken = await models.UsersTokens.findOne({where: {users_id:decoded_jwt.aud, token:header} });

    if(userToken)
      throw Error(constants.TOKEN_REVOKED); // 403

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

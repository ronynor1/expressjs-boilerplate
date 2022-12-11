const error_codes = require('../../config/error-codes');
const logger = require('../../helpers/logger.js')(module);

// store tokens in db
exports.logout = async function(models, id, req_body) {

    try {

        // insert acces and refresh tokens to check for it in the jwt-middleware
        await models.UsersTokens.create({users_id: id, token: req_body['accessToken']})
        await models.UsersTokens.create({users_id: id, token: req_body['refreshToken']})

        return true;

    } catch (error) {
        if(error_codes[error.message] === undefined )
          logger.error(error.message);
        throw Error(error.message);
      }

}

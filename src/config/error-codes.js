module.exports = {
    NOT_FOUND : {
        status : 404,
        code : 1000
    },
    ALREADY_EXISTS : {
        status : 409,
        code : 1001
    },
    TOKEN_REVOKED : {
        status : 401,
        code : 1002
    },
    MISSING_REQUIRED_FIELDS : {
        status : 401,
        code : 1003
    },
    PASSWORD_NOT_MATCH : {
        status : 401,
        code : 1004
    },
    WRONG_CREDENTIALS : {
        status : 401,
        code : 1005
    },
    INVALID_VERIFICATION_CODE : {
        status : 401,
        code : 1006
    },
    EMPTY_BODY : {
        status : 400,
        code : 1007
    },
    ALREADY_IN_USE : {
        status : 409,
        code : 1008
    },
}

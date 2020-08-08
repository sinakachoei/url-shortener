const errorCodes = require('../config/errorCodes');

module.exports = {
    handlerServerError(res, error) {
        const {data, errorCode, message} = error;
        const code = errorCode || errorCodes.INTERNAL_ERROR;
        const status = errorCode ? 406 : 500;
        const result = {
            result: 'ERR',
            message,
        };
        if (data) {
            result.data = data;
        }
        result.errorCode = code;
        res.status(status).json({
            result,
        });
    },
};

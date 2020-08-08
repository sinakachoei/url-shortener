const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt')[process.env.NODE_ENV];
const errorCodes = require('../config/errorCodes');

function resolveError(error) {
    if (error.name === 'TokenExpiredError') {
        return errorCodes.EXPIRED_TOKEN;
    }
    return  errorCodes.INVALID_TOKEN;
}

const jwtMiddleware = {
    jwtParser: (req, res, next) => {
        const token = req.headers['x-authorization'];
        if (token) {
            try {
                res.locals.decodedToken =
                    jwt.verify(token, jwtConfig.secretKey, jwtConfig.verifyToken.verifyOptions);
                req.user = res.locals.decodedToken;
                next();
            } catch (error) {
                console.log(error);
                const errorCode = resolveError(error);
                res.status(403).json({
                    result: 'ERR',
                    data: {
                        errorCode,
                    },
                });
            }
        } else {
            next();
        }
    },
};

module.exports = jwtMiddleware;

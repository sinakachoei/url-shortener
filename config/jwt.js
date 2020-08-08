module.exports = {
    TEST: {
        secretKey: 'Sina Kachoei!',
        verifyToken: {
            verifyOptions: {
                algorithms: ['HS512'],
                audience: 'app',
                subject: 'signToken',
                issuer: 'userService',
            },
        },
        signToken: {
            verifyOptions: {
                algorithm: 'HS512',
                audience: 'app',
                subject: 'signToken',
                issuer: 'userService',
                expiresIn: '7d',
            },
        },
    },
    DEVELOPMENT: {},
    PRODUCTION: {},
};



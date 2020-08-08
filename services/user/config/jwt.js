module.exports = {
    TEST: {
        secretKey: 'Sina Kachoei!',
        verifyOptions: {
            algorithm: 'HS512',
            audience: 'app',
            subject: 'signToken',
            issuer: 'userService',
            expiresIn: '7d',
        },

    },
    DEVELOPMENT: {},
    PRODUCTION: {},
};

const processEnv = process.env.NODE_ENV;
const jwtConfig = require('../../../config/jwt')[processEnv];
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const errorCodes = require('../config/errorCodes');

const userDataAccess = require('../dataaccess/user');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function authenticate({ username, password }) {
    const user = await userDataAccess.fetchByUserName(username);
    try {
        if (user && bcrypt.compareSync(password, user.hash)) {
            const token = jwt.sign({id: user.id, email: user.email}, jwtConfig.secretKey, jwtConfig.signToken.verifyOptions);
            return {
                user: user.toJSON(),
                token
            };
        }
    } catch (error) {
        throw {errorCode: errorCodes.INCORRECT_USER_NAME_OR_PASSWORD}
    }
}

async function getAll() {
    return await userDataAccess.fetchAll();
}

async function getById(id) {
    return await userDataAccess.fetchById(id);
}

async function create(userParam) {
    if (await userDataAccess.fetchByUserName(userParam.username))
        throw {
            errorCode: errorCodes.USER_NAME_ALREADY_TAKEN,
            message: "This username is already taken",
        };

    if (await userDataAccess.fetchByUserEmail(userParam.email))
        throw {
            errorCode: errorCodes.EMAIL_ALREADY_REGISTERED,
            message: "This email is already registered",
        };

    return await userDataAccess.insert(userParam);
}

async function update(id, userParam) {
    const user = await userDataAccess.fetchById(id);
    if (!user)
        throw {errorCode: errorCodes.USER_NOT_FOUND};

    if (user.username !== userParam.username && await userDataAccess.fetchByUserName(userParam.username))
        throw {errorCode: errorCodes.USER_NAME_ALREADY_TAKEN};

    const updateData = {...user.toJSON(), ...userParam};
    return await userDataAccess.update(id, updateData);
}

async function _delete(id) {
    await userDataAccess.delete(id);
}
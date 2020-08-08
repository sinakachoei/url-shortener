const express = require('express');
const router = express.Router();

const validator = require('../validator/bodyFieldValidator');

const userService = require('../../services/user/application/user');

const errorHandler = require('../util/errorHandler');

router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


async function authenticate(req, res, next) {
    try {
        const {username, password} = req.body;
        const { token } = await userService.authenticate({username, password});
        const result = {
            result: 'OK',
            message: 'You have authenticated successfully',
            data: {token}
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function register(req, res, next) {
    try {
        const {username, password, email} = req.body;
        validator.notNull(password, 'password');
        validator.notNull(username, 'username');
        validator.notNull(email, 'email');

        validator.isValidEmail(email);
        const user = await userService.create({username, password, email});
        const result = {
            result: 'OK',
            message: 'You have registered successfully',
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function getAll(req, res, next) {
    try {
        const users = await userService.getAll();
        const result = {
            result: 'OK',
            data: {users},
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function getCurrent(req, res, next) {
    try {
        validator.isAuthenticated(req);
        const userId = req.user.id;
        const user = await userService.getById(userId);
        const result = {
            result: 'OK',
            data: {user},
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function getById(req, res, next) {
    try {
        const userId = req.params.id;
        const user = await userService.getById(userId);
        const result = {
            result: 'OK',
            data: {user},
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function update(req, res, next) {
    try {
        validator.isAuthenticated(req);
        const userId = req.user.id;
        const {username, password, email} = req.body;
        const user = await userService.update(userId, {username, password, email});
        const result = {
            result: 'OK',
            data: {user},
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function _delete(req, res, next) {
    try {
        const userId = req.params.id;
        await userService.delete(userId);
        const result = {
            result: 'OK',
            data: {},
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}
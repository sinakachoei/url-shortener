const express = require('express');
const router = express.Router();

const validator = require('../validator/bodyFieldValidator');

const urlService = require('../../services/urlShortener/application/shortener');

const errorHandler = require('../util/errorHandler');

router.post('/', shortenUrl);
router.get('/', getShortUrl);

module.exports = router;

async function shortenUrl(req, res, next) {
    try {
        validator.isAuthenticated(req);
        const userId = req.user.id;
        const {url, suggestedUrl} = req.body;
        validator.isValidUrl(url);
        if (suggestedUrl)
            validator.isSuggestedUrlValid(suggestedUrl);
        const { shortUrl } = await urlService.shortenUrl({userId, url, suggestedUrl});
        const result = {
            result: 'OK',
            data: {shortUrl}
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

async function getShortUrl(req, res, next) {
    try {
        validator.isAuthenticated(req);
        const userId = req.user.id;
        const {url} = req.body;
        validator.isValidUrl(url);
        const { shortUrl } = await urlService.getShortUrl({userId, url});
        const result = {
            result: 'OK',
            data: {shortUrl}
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

const express = require('express');
const router = express.Router();

const validator = require('../validator/bodyFieldValidator');

const urlService = require('../../services/urlShortener/application/shortUrlPresenter');

const errorHandler = require('../util/errorHandler');


router.get(/^\/(.+)/, redirectShortUrl);

module.exports = router;

async function redirectShortUrl(req, res, next) {
    try {
        const urlPath = req.params[0];
        validator.notNull(urlPath, 'urlPath');
        const {isMobile, browser} = req.useragent;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const { url } = await urlService.getMainUrl({urlPath, requesterData: {ip, isMobile, browser}});
        res.redirect(url);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}


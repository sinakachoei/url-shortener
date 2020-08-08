const express = require('express');
const router = express.Router();

const validator = require('../validator/bodyFieldValidator');

const summaryService = require('../../services/visitSummary/application/summary');

const errorHandler = require('../util/errorHandler');

router.get('/', getSummary);

module.exports = router;

async function getSummary(req, res, next) {
    try {
        validator.isAuthenticated(req);
        const userId = req.user.id;
        const {shortUrl} = req.body;
        validator.isValidUrl(shortUrl);
        const { summary } = await summaryService.getShortUrlSummary({userId, shortUrl});
        const result = {
            result: 'OK',
            data: {summary}
        };
        res.status(200).json(result);
    } catch (error) {
        errorHandler.handlerServerError(res, error);
    }
}

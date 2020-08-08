const summaryDataAccess = require('../dataacess/summary');
const urlService = require('../../urlShortener/application/shortener');

module.exports = {
    async getShortUrlSummary({userId, shortUrl}) {
        await urlService.getByShortUrl({userId, shortUrl});
        const summary = await summaryDataAccess.fetchByUrl(shortUrl);
        return {summary};
    }
};

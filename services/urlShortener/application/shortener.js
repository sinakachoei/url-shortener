const processEnv = process.env.NODE_ENV;
const shortid = require("shortid");

const errorCodes = require('../config/errorCodes');
const urlShortenerConfig = require('../../../config/urlShortener');
const summaryApp = require('../../visitSummary/application/initialSummary');
const urlDataAccess = require('../dataaccess/shortUrl');

const redisCache = require('../../../util/redisCache');


function createShortUrl(url, suggestedUrl) {
    const urlCode = shortid.generate();
    return suggestedUrl ? suggestedUrl + "/" + urlCode : urlShortenerConfig.REDIRECT_BASE_URL + "/" + urlCode;
}

async function shortenUrl({ userId, url, suggestedUrl }) {
    const existedUrl = await urlDataAccess.fetchByUrlAndUserId(userId, url);
    if (existedUrl) {
        throw {errorCode: errorCodes.URL_ALREADY_CREATED_FOR_YOU, data: {url: existedUrl.shortUrl}};
    }
    const shortUrl = createShortUrl(url, suggestedUrl);
    const shortUrlData = {
        url,
        shortUrl,
        userId,
    };
    await urlDataAccess.insert(shortUrlData);
    await redisCache.set(shortUrl, url);
    await summaryApp.addSummaryToNewShortUrl(shortUrl);
    return {shortUrl};
}

async function getShortUrl({ userId, url }) {
    const existedUrl = await urlDataAccess.fetchByUrlAndUserId(userId, url);
    if (!existedUrl)
        throw {
            errorCode: errorCodes.URL_NOT_EXISTED,
            message: "Url is not created by this user",
        };
    return {shortUrl: existedUrl}
}

async function getByShortUrl({ userId, shortUrl }) {
    const shortUrlRecord = await urlDataAccess.fetchByShortUrlAndUserId(userId, shortUrl);
    if (!shortUrlRecord)
        throw {
            errorCode: errorCodes.SHORT_URL_NOT_EXITED_FOR_USER_ID,
            message: "Short url is not created by this user",
        };
    return {shortUrl: shortUrlRecord};
}

module.exports = {
    shortenUrl,
    getShortUrl,
    getByShortUrl,
};

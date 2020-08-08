const errorCodes = require('../config/errorCodes');
const urlShortenerConfig = require('../../../config/urlShortener');
const Promise = require('bluebird');
const redisCache = require('../../../util/redisCache');
const urlVisitDataAccess = require('../dataaccess/urlVisit');
const deviceTypes = require('../../../enum/deviceTypes');

module.exports = {
    getMainUrl,
    getVisitsBetweenDates,
};

async function getMainUrl({ urlPath, requesterData }) {
    const shortUrl = urlShortenerConfig.REDIRECT_BASE_URL + "/" + urlPath;
    return new Promise((resolve, reject) => {
        redisCache.client.get(shortUrl, async(err, mainUrl) => {
            if (!mainUrl) {
                reject({
                    errorCode: errorCodes.SHORT_URL_NOT_FOUND,
                    message: 'Url not found',
                })
            }
            const urlVisitData = {
                shortUrl,
                ip: requesterData.ip,
                deviceType: requesterData.isMobile ? deviceTypes.MOBILE : deviceTypes.DESKTOP,
                browser: requesterData.browser,
            };
            await urlVisitDataAccess.insert(urlVisitData);
            resolve({url: mainUrl});
        });
    });
}

async function getVisitsBetweenDates(startDate, endDate) {
    return urlVisitDataAccess.fetchByCreationDate(startDate, endDate);
}

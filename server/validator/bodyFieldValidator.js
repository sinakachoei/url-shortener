const validUrl = require('valid-url');

const errorCodes = require('../config/errorCodes');
const urlShortenerConfig = require('../../config/urlShortener');

module.exports = {
    notNull(field, fieldName) {
        if (field === undefined || field === null) {
            throw {
                errorCode: errorCodes.INVALID_DATA,
                message: `field ${fieldName} should not be empty`,
            }
        }
    },
    isValidEmail(email) {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if(!emailRegexp.test(email)) {
            throw {
                errorCode: errorCodes.INVALID_EMAIL,
                message: 'The email address is not valid',
            }
        }
    },
    isValidUrl(url) {
        if (!validUrl.isUri(url)) {
            throw {
                errorCode: errorCodes.INVALID_URL,
                message: 'The url address is not valid',
            }
        }
    },
    isSuggestedUrlValid(url) {
        this.isValidUrl(url);
        if (url.indexOf(urlShortenerConfig.REDIRECT_BASE_URL) < 0) {
            throw {
                errorCode: errorCodes.INVALID_URL_DOMAIN,
                message: `Your suggested url should be begin with ${urlShortenerConfig.REDIRECT_BASE_URL}`,
            }
        }
    },
    isAuthenticated(req) {
        if (!req.user) {
            throw {
                errorCode: errorCodes.NOT_AUTHENTICATED,
                message: `Please authenticate yourself first`,
            }
        }
    }
};

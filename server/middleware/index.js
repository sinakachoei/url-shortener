const bodyParser = require('body-parser');
const bodyParserJsonError = require('express-body-parser-json-error');
const cors = require('cors');
const jwt = require('./jwt');
const useragent = require('express-useragent');

const init = (app) => {
    app.use(useragent.express());
    app.use(bodyParser.json());
    app.use(bodyParserJsonError());
    // app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded({
        extended: false,
    }));
    // app.use(cors);
    app.use(jwt.jwtParser);
};

module.exports = init;

const express = require('express');
const path = require('path');
const middleware = require('./middleware');

const app = express();
middleware(app);

app.use('/users', require('./services-presentation/user'));
app.use('/url-shortener', require('./services-presentation/urlShortener'));
app.use('/summary', require('./services-presentation/summary'));
app.use('/public', require('./services-presentation/redirectShortUrl'));


module.exports = app;

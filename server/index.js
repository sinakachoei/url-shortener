const app = require('./app');
const mongoose = require('mongoose');
const scheduler = require("node-schedule");

const serverConfig = require('../config/server');
const mongoConfig = require('../config/mongoDB');

const dailySynchronizer = require('../services/visitSummary/application/dailySychnronizer');
const hourlySynchronizer = require('../services/visitSummary/application/hourlySynchronizer');

const processEnv = process.env.NODE_ENV;
const port = process.env.PORT || serverConfig[processEnv].port;
const url = serverConfig[processEnv].url;

app.set('port', port);

async function scheduleCronJobs() {
    scheduler.scheduleJob("30 * * * *", function() {
        console.log("running hourly cronjob every 30 minutes");
        hourlySynchronizer.runHourlyCronJob();
    });
    scheduler.scheduleJob("59 59 23 * * *", function() {
        console.log("running daily cronjob every hour. at 23:59:59 pm of every day ");
        dailySynchronizer.runDailyCronJob();
    });
}

let server;
const run = async () => {
    try {
        server = app.listen(app.get('port'), () => {});

        if (mongoose.connection.readyState !== 1)
            await mongoose.connect(mongoConfig.MONGO_DB_URL, mongoConfig.CONNECTION_OPTIONS);

        console.log(`Server is up now on address ${url} and port ${port}`);

        scheduleCronJobs();
    } catch (error) {
        setTimeout(() => {process.exit(1);}, 3000);
    }
};

run();

module.exports = server;

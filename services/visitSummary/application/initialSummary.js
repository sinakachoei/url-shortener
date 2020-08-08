const summaryDataAccess = require('../dataacess/summary');

module.exports = {
    async addSummaryToNewShortUrl(shortUrl) {
        const baseVisits = {
            total: 0,
            mobile: 0,
            desktop: 0,
            perBrowser: [],
        };
        const summaryData = {
            shortUrl,
            todaySummary: baseVisits,
            yesterdaySummary: baseVisits,
            weeklySummary: baseVisits,
            monthlySummary: baseVisits,
        };
        await summaryDataAccess.insert(summaryData);
    },
};

const urlVisitsDataAccess = require('../../urlShortener/dataaccess/urlVisit');
const summaryDataAccess = require('../dataacess/summary');

const lastUpdateDataAccess = require('../dataacess/lastUpdatedVisit');
const deviceTypes = require('../../../enum/deviceTypes');

const hourlyConfig = require('../config/hourly');

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function updatePerBrowserVisits(visits, summaryRecord) {
    const {perBrowser} = summaryRecord.todaySummary.visits;
    for (const visit of visits) {
        const browser = perBrowser.find(browser => browser.browserName === visit.browser);
        if (!browser) {
            perBrowser.push({browserName: visit.browser, count: 1});
        } else {
            const browserIndex = perBrowser.indexOf(browser);
            perBrowser[browserIndex].count += 1;
        }
    }
    return perBrowser;
}


function getUrlTodayVisitUpdateData(visits, summaryRecord) {
    const {todaySummary} = summaryRecord;
    updatePerBrowserVisits(visits, summaryRecord);
    todaySummary.visits.total += visits.length;
    todaySummary.visits.desktop += visits.filter(visit => visit.deviceType === deviceTypes.DESKTOP).length;
    todaySummary.visits.mobile += visits.filter(visit => visit.deviceType === deviceTypes.MOBILE).length;

    return {...summaryRecord, todaySummary};
}

module.exports = {
    async runHourlyCronJob() {
        const {lastId,_id} = await lastUpdateDataAccess.fetch();
        const unSummarizedVisits = await urlVisitsDataAccess.fetchByIdAndPagination(lastId, hourlyConfig.BATCH_SIZE);
        const groupedUrls = groupBy(unSummarizedVisits, urlVisit => urlVisit.shortUrl);

        if (unSummarizedVisits.length > 0) {
            for (const entry of groupedUrls.entries()) {
                const [shortUrl, visits] = entry;
                const summaryRecord = await summaryDataAccess.fetchByUrl(shortUrl);
                const updatedData = getUrlTodayVisitUpdateData(visits, summaryRecord);
                await summaryDataAccess.update(summaryRecord._id, updatedData);
            }
            const lastVisit = unSummarizedVisits.pop();
            await lastUpdateDataAccess.update(_id, lastVisit._id + 1);
        }
    },
};

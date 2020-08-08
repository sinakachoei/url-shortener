const summaryDataAccess = require('../dataacess/summary');

const deviceTypes = require('../../../enum/deviceTypes');

const urlShortenerApplication = require('../../urlShortener/application/shortUrlPresenter');

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

function getNDaysBeforeStartDate(n) {
    const date = new Date();
    date.setDate(date.getDate() - n);
    date.setHours(0,0,0,0);
    return date;
}

function getNDaysBeforeEndDate(n) {
    const date = new Date();
    date.setDate(date.getDate() - n);
    date.setHours(23,59,59,999);
    return date;
}

function subtractBrowserVisits(visits, perBrowser) {
    for (const visit of visits) {
        const browser = perBrowser.find(browser => browser.browserName === visit.browser);
        const browserIndex = perBrowser.indexOf(browser);
        perBrowser[browserIndex].count -= 1;
    }
    return perBrowser;
}

function addBrowserVisits(visits, summary) {
    const {perBrowser} = summaryRecord.visits;
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

function subtractVisits(visits, summary) {
    const {perBrowser} = summary.visits;
    subtractBrowserVisits(visits, perBrowser);
    summary.visits.total -= visits.length;
    summary.visits.desktop -= visits.filter(visit => visit.deviceType === deviceTypes.DESKTOP).length;
    summary.visits.mobile -= visits.filter(visit => visit.deviceType === deviceTypes.MOBILE).length;
    return summary;
}

function addYesterdayVisits(visits, summary) {
    const {perBrowser} = summary.visits;
    addBrowserVisits(visits, perBrowser);
    summary.visits.total += visits.length;
    summary.visits.desktop += visits.filter(visit => visit.deviceType === deviceTypes.DESKTOP).length;
    summary.visits.mobile += visits.filter(visit => visit.deviceType === deviceTypes.MOBILE).length;
    return summary;
}

async function subtractThirtyDaysAgoVisitsFromMonthly() {
    const startDate = getNDaysBeforeStartDate(30);
    const endDate = getNDaysBeforeEndDate(30);

    const thirtyDaysBeforeVisits =
        await urlShortenerApplication.getVisitsBetweenDates(startDate, endDate);
    const groupedUrls = groupBy(thirtyDaysBeforeVisits, urlVisit => urlVisit.shortUrl);

    if (thirtyDaysBeforeVisits.length > 0) {
        for (const entry of groupedUrls.entries()) {
            const [shortUrl, visits] = entry;
            const summaryRecord = await summaryDataAccess.fetchByUrl(shortUrl);
            const updatedData = {...summaryRecord, ...subtractVisits(visits, summaryRecord.monthlySummary)};
            await summaryDataAccess.update(summaryRecord._id, updatedData);
        }
    }
}

async function subtractSevenAgoVisitsFromWeekly() {
    const startDate = getNDaysBeforeStartDate(7);
    const endDate = getNDaysBeforeEndDate(7);
    const sevenDaysBeforeVisits =
        await urlShortenerApplication.getVisitsBetweenDates(startDate, endDate);
    const groupedUrls = groupBy(sevenDaysBeforeVisits, urlVisit => urlVisit.shortUrl);

    if (sevenDaysBeforeVisits.length > 0) {
        for (const entry of groupedUrls.entries()) {
            const [shortUrl, visits] = entry;
            const summaryRecord = await summaryDataAccess.fetchByUrl(shortUrl);
            const updatedData = {...summaryRecord, ...subtractVisits(visits, summaryRecord.weeklySummary)};
            await summaryDataAccess.update(summaryRecord._id, updatedData);
        }
    }
}

async function addYesterdayVisitsToWeeklyAndMonthly() {
    const startDate = getNDaysBeforeStartDate(1);
    const endDate = getNDaysBeforeEndDate(1);
    const yesterdayVisits =
        await urlShortenerApplication.getVisitsBetweenDates(startDate, endDate);
    const groupedUrls = groupBy(yesterdayVisits, urlVisit => urlVisit.shortUrl);

    if (yesterdayVisits.length > 0) {
        for (const entry of groupedUrls.entries()) {
            const [shortUrl, visits] = entry;
            const summaryRecord = await summaryDataAccess.fetchByUrl(shortUrl);
            const updatedData = {...summaryRecord, ...addYesterdayVisits(visits, summaryRecord.yesterdaySummary)};
            await summaryDataAccess.update(summaryRecord._id, updatedData);
        }
    }
}

async function recalculateYesterdayAndTodaySummary() {
    const startDate = getNDaysBeforeStartDate(1);
    const endDate = getNDaysBeforeEndDate(1);
    const yesterdayVisits =
        await urlShortenerApplication.getVisitsBetweenDates(startDate, endDate);
    const groupedUrls = groupBy(yesterdayVisits, urlVisit => urlVisit.shortUrl);

    if (yesterdayVisits.length > 0) {
        for (const entry of groupedUrls.entries()) {
            const [shortUrl, visits] = entry;
            const summaryRecord = await summaryDataAccess.fetchByUrl(shortUrl);
            const {todaySummary} = summaryRecord;
            const updatedData = {
                ...summaryRecord,
                yesterdaySummary: todaySummary,
                todaySummary: {
                    total: 0,
                    mobile: 0,
                    desktop: 0,
                    perBrowser: [],
                },
            };
            await summaryDataAccess.update(summaryRecord._id, updatedData);
        }
    }
}


module.exports = {
    async runDailyCronJob() {
        await subtractThirtyDaysAgoVisitsFromMonthly();
        await subtractSevenAgoVisitsFromWeekly();
        await addYesterdayVisitsToWeeklyAndMonthly();
        await recalculateYesterdayAndTodaySummary();
    },
};

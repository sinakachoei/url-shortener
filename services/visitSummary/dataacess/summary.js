const Summary = require('../model/summary');

module.exports = {
    fetchByUrl,
    insert,
    update,
};

async function fetchByUrl(shortUrl) {
    const summary = await Summary.findOne({shortUrl});
    return summary.toObject();
}

async function insert(summaryData) {
    const summary = new Summary(summaryData);
    return await summary.save();
}

async function update(id, updateData) {
    return await Summary.findByIdAndUpdate(id, updateData, {new: true});
}
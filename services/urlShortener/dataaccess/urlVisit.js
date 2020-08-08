const Visit = require('../model/urlVisit');

module.exports = {
    fetchAll,
    fetchById,
    insert,
    update,
    delete: _delete,
    // fetchByDate,
    fetchByIdAndPagination: fetchByIdAndLimit,
    fetchByCreationDate,
};

async function fetchAll() {
    return await Visit.find();
}

async function fetchByIdAndLimit(lastId, limit) {
    return await Visit.find({_id: {$gte: lastId}})
        .limit(limit)
        .sort('_id');
}

// async function fetchByDate(date) {
//     return await Visit.findOne({createdDate: {$gt: date}});
// }

async function fetchByCreationDate(startDate, endDate) {
    return await Visit.find({createdDate: {$gte: startDate, $lt: endDate}});
}

async function fetchById(id) {
    return await Visit.findById(id);
}

async function insert(data) {
    const shortUrl = new Visit(data);
    await shortUrl.save();
}

async function update(id, updateData) {
    return await Visit.findByIdAndUpdate(id, updateData, {new: true});
}

async function _delete(id) {
    await Visit.findByIdAndRemove(id);
}
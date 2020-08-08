const LastUpdatedVisit = require('../model/lastUpdatedVisit');

module.exports = {
    fetch,
    insert,
    update,
};

async function fetch() {
    const lastUpdated = await LastUpdatedVisit.find();
    if (!lastUpdated || lastUpdated.length === 0) {
        return await insert()
    }
    return lastUpdated[0];
}

async function insert() {
    const lastVisit = new LastUpdatedVisit({lastId: 0});
    return await lastVisit.save();
}

async function update(id, lastId) {
    const updateData = {
        lastId,
        updateDate: new Date(),
    };
    return await LastUpdatedVisit.findByIdAndUpdate(id, updateData, {new: true});
}
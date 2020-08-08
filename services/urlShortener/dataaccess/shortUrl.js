const ShortUrl = require('../model/short-url');

module.exports = {
    fetchAll,
    fetchById,
    insert,
    update,
    delete: _delete,
    fetchByUrlAndUserId,
    fetchByShortUrlAndUserId,
};

async function fetchAll() {
    return await ShortUrl.find();
}

async function fetchByUrlAndUserId(userId, url) {
    return await ShortUrl.findOne({userId, url});
}

async function fetchById(id) {
    return await ShortUrl.findById(id);
}

async function fetchByShortUrlAndUserId(userId, shortUrl) {
    const short = await ShortUrl.findOne({userId, shortUrl});
    return short.toObject();
}

async function insert(data) {
    const shortUrl = new ShortUrl(data);
    await shortUrl.save();
}

async function update(id, updateData) {
    return await ShortUrl.findByIdAndUpdate(id, updateData, {new: true});
}

async function _delete(id) {
    await ShortUrl.findByIdAndRemove(id);
}
const bcrypt = require('bcryptjs');
const User = require('../model/user');

module.exports = {
    fetchAll,
    fetchById,
    insert,
    update,
    delete: _delete,
    fetchByUserName,
    fetchByUserEmail,
};

async function fetchAll() {
    return await User.find();
}

async function fetchByUserName(username) {
    return await User.findOne({username});
}

async function fetchByUserEmail(email) {
    return await User.findOne({email});
}

async function fetchById(id) {
    return await User.findById(id);
}

async function insert(userParam) {
    const user = new User(userParam);
    if (userParam.password)
        user.hash = bcrypt.hashSync(userParam.password, 10);
    return await user.save();
}

async function update(id, updateData) {
    if (updateData.password)
        updateData.hash = bcrypt.hashSync(updateData.password, 10);

    return await User.findByIdAndUpdate(id, updateData, {new: true});
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
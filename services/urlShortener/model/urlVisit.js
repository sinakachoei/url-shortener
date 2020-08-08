const mongoose      = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

const visitSchema = new Schema({
    shortUrl: { type: String, required: true },
    ip: { type: String, required: true },
    browser: { type: String, required: true },
    deviceType: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
});

visitSchema.plugin(autoIncrement.plugin, 'Visit');
visitSchema.index({"createdDate": 1});

module.exports = mongoose.model('Visit', visitSchema);

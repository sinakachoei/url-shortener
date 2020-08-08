const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lastUpdatedVisitSchema = new Schema({
    lastId: { type: Number, required: true },
    createdDate: { type: Date, default: Date.now },
    updateDate: { type: Date},
});

module.exports = mongoose.model('LastUpdatedVisit', lastUpdatedVisitSchema);
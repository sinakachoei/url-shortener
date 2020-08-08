const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SummarySchema = new Schema({
    _id: false,
    visits: {
        total: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        desktop: { type: Number, default: 0 },
        perBrowser: [{
            _id: false,
            browserName: {type: String},
            count: { type: Number, default: 0 }
        }],
    },
});


const summarySchema = new Schema({
        shortUrl: { type: String, required: true, unique: true },
        createdDate: { type: Date, default: Date.now },
        todaySummary: {
            type: SummarySchema,
        },
        yesterdaySummary: {
            type: SummarySchema,
        },
        weeklySummary: {
            type: SummarySchema,
        },
        monthlySummary: {
            type: SummarySchema,
        },
    },
);

module.exports = mongoose.model('Summary', summarySchema);
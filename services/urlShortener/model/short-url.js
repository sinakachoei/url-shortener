const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SummarySchema = new Schema({
    visits: {
        total: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        desktop: { type: Number, default: 0 },
    },
    uniqueVisiters: {
        total: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        desktop: { type: Number, default: 0 },
        perBrowser: [{
            browser: {type: String},
            count: { type: Number, default: 0 }
        }],
    }
});


const schema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    url: { type: String, required: true },
    shortUrl: { type: String, required: true },
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
{
    toObject: {
        transform: (doc, ret) => {
            delete ret.__v;
        },
    },
});

schema.set('toJSON', {
    versionKey: false,
});

module.exports = mongoose.model('ShortUrl', schema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    email: { type: String, required: true, unique: true },
},
{
    toObject: {
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
        },
    },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('User', schema);
const mongoose = require('mongoose');

let AccountSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: Date,
    type: {
        type: Number,
        default: -1
    },
    account: {
        type: Number,
        required: true
    },
    remarks: {
        type: String
    }
})

let AccountModel = mongoose.model('accounts', AccountSchema);

module.exports = AccountModel;
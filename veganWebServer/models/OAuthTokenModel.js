const mongoose = require('mongoose');
const { Schema } = mongoose;

const OAuthTokenSchema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tokenType: {
        type: String,
        required: true
    },
    scope: {
        type: String
    },
    expiryDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema);

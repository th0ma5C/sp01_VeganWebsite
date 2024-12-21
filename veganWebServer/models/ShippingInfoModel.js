const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const ShippingInfoSchema = new Schema({
    userID: {
        type: String, required: true, index: true, unique: true,
        validate: {
            validator: (val) => (/^[A-Za-z0-9_-]{6}$/.test(val) || Types.ObjectId.isValid(val)),
            message: 'invalid userID',
        }
    },
    email: { type: String, required: true },
    consigneeName: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    postal: { type: String },
    contactNo: { type: String, required: true },
    saveInfo: { type: Boolean },
    subNews: { type: Boolean },
    deliveryType: { type: String, enum: ['宅配', '超商'], required: true },
    storeBranch: { type: String, default: null },
    storeAddr: { type: String, default: null },
    paymentType: { type: String, enum: ['匯款', '信用卡', '貨到付款', '電子支付'], required: true }
});

// ShippingInfoSchema.pre('save', function (next) {
//     if (this.userID && typeof this.userID === 'string') {
//         if (mongoose.Types.ObjectId.isValid(this.userID)) {
//             this.userID = new mongoose.Types.ObjectId(this.userID);
//             next();
//         } else if (/^[A-Za-z0-9_-]{6}$/.test(this.userID)) {
//             next();
//         } else {
//             return next(new Error('Invalid userID format.'));
//         }
//     } else {
//         next();
//     }
// });

// ShippingInfoSchema.pre(['find', 'findOne'], function (next) {
//     const queryWord = this.getFilter()['purchaseOrder.userID'];
//     if (queryWord) {
//         const isGuestID = /^[A-Za-z0-9_-]{6}$/.test(queryWord);
//         const translateQuery = isGuestID ? queryWord : new mongoose.Types.ObjectId(queryWord);
//         this.setQuery({ ...this.getFilter(), 'purchaseOrder.userID': translateQuery });
//     }
//     next();
// });

module.exports = model('shippingInfo', ShippingInfoSchema);

const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const ShippingInfoSchema = new Schema({
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
})

const OrderItemSchema = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const PurchaseOrderSchema = new Schema({
    userID: {
        type: Schema.Types.Mixed, required: true, index: true
    },
    orderList: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    freightFee: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['new', 'processed', 'shipped', 'completed', 'cancelled'],
        default: 'new'
    }
});

// PurchaseOrderSchema.pre('save', function (next) {
//     if (typeof this.userID === 'string') {
//         if (Types.ObjectId.isValid(this.userID)) {
//             this.userID = new Types.ObjectId(this.userID);
//             next();
//         } else if (/^[A-Za-z0-9_-]{6}$/.test(this.userID)) {
//             next();
//         } else {
//             return next(new Error('Invalid userID format.'));
//         }
//     }
// });

const OrderSchema = new Schema({
    shippingInfo: { type: ShippingInfoSchema, required: true },
    purchaseOrder: { type: PurchaseOrderSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', function (next) {
    const purchaseOrder = this.purchaseOrder;
    // console.log('@@@ purchaseOrder save middleware');
    if (purchaseOrder && typeof purchaseOrder.userID === 'string') {
        if (mongoose.Types.ObjectId.isValid(purchaseOrder.userID)) {
            purchaseOrder.userID = new mongoose.Types.ObjectId(purchaseOrder.userID);
            next();
        } else if (/^[A-Za-z0-9_-]{6}$/.test(purchaseOrder.userID)) {
            next();
        } else {
            return next(new Error('Invalid userID format.'));
        }
    } else {
        next();
    }
});

OrderSchema.pre(['find', 'findOne'], function (next) {
    const queryWord = this.getFilter()['purchaseOrder.userID'];
    if (queryWord) {
        const isGuestID = /^[A-Za-z0-9_-]{6}$/.test(queryWord);
        const translateQuery = isGuestID ? queryWord : new mongoose.Types.ObjectId(queryWord);
        this.setQuery({ ...this.getFilter(), 'purchaseOrder.userID': translateQuery });
    }
    next();
});


module.exports = model('orders', OrderSchema);

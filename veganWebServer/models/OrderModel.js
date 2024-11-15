// 訂單資料表
const { Schema, model } = require('mongoose');



const OrderSchema = Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'user' },
    shippingInfo: {},
    orderList: [
        {
            name: String,
            amount: Number,
            subtotal: Number
        },
    ],
    total: Number,
    freightFee: Number,
    discountAmount: Number,
    couponAmount: Number,
    status: { type: String, default: 'pending' }, // 訂單狀態: pending, paid, shipped, delivered, etc.
    createdAt: { type: Date, default: Date.now },
});

module.exports = model('orders', OrderSchema);

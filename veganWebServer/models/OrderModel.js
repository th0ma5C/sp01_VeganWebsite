const { Schema, model } = require('mongoose');

const ShippingInfoSchema = new Schema({
    email: { type: String, required: true },
    consigneeName: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    postal: { type: String },
    contactNo: { type: String, required: true },
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

const OrderSchema = new Schema({
    shippingInfo: { type: ShippingInfoSchema, required: true },
    purchaseOrder: { type: PurchaseOrderSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


module.exports = model('orders', OrderSchema);

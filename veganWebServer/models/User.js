const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const MenuItem = require('./MenuModel');

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

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joinPrivacyPolicy: { type: Boolean, required: true },
    verified: { type: Boolean, required: true },
    shippingInfo: { type: ShippingInfoSchema },
    cart: [
        {
            item: { type: Schema.Types.ObjectId, ref: 'menu.items', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.method('validatePassword', async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
})

module.exports = model('user', userSchema);

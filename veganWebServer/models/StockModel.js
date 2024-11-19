const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now } // 用於快取檢查是否需要更新
});

module.exports = mongoose.model('Stocks', StockSchema);

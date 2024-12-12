const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stocks', StockSchema);

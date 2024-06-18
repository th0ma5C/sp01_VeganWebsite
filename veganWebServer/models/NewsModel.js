const mongoose = require('mongoose');

// 定義News的Schema
const contentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const unifiedSchema = new mongoose.Schema({
    會員: [contentSchema],
    活動: [contentSchema],
    優惠: [contentSchema]
});


// 創建News模型
const News = mongoose.model('News', unifiedSchema);

module.exports = News;

const mongoose = require('mongoose');

// 定義News的Schema
const NewsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    label: { type: String, required: true }
});

// 創建News模型
const News = mongoose.model('News', NewsSchema);

module.exports = News;

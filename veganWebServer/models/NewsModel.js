const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    label: { type: String, required: true }
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;

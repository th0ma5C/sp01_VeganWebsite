const { Schema, model } = require('mongoose');

const contentSchema = new Schema({
    tag: { type: String, required: true },
    content: { type: String, required: true }
}, { _id: false });

const gptResultSchema = new Schema({
    gpt_user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    gpt_content: {
        type: [contentSchema],
        required: true
    },
    gpt_stamp: {
        type: Number, required: true
    }
});

module.exports = model('GptResult', gptResultSchema);
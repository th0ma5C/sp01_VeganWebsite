const { Schema, model } = require('mongoose');

const questionnaireSchema = new Schema({
    question: { type: String },
    options: [String],
    tag: String
}, { collection: 'questionnaire' });

const QuestionnaireModel = model('questionnaire', questionnaireSchema);

module.exports = QuestionnaireModel;
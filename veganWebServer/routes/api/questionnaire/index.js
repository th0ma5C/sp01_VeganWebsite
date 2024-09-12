const QuestionnaireModel = require('@models/QuestionnaireModel');

async function getQuestionnaire(req, res) {
    try {
        const data = await QuestionnaireModel.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(getQuestionnaire.name, error);
    }
}

module.exports = {
    getQuestionnaire,
}
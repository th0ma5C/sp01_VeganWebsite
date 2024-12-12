const { Schema, model } = require('mongoose');

const surveyResultSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    info: {
        userName: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female'], required: true },
        birth: {
            type: [Number],
            required: true,
            validate: {
                validator: function (v) {
                    return v.length === 3 && v[0] > 1900 && v[1] > 0 && v[1] <= 12 && v[2] > 0 && v[2] <= 31;
                },
                message: 'Birth must be an array of [year, month, day] with valid values.'
            }
        },
    },
    habit: {
        type: String,
        enum: ['完全素食', '蛋奶素', '健康飲食但非素食', '無偏好'],
        required: true
    },
    flavor: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    food: {
        type: [String],
        required: true
    },
    calories: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('SurveyResult', surveyResultSchema);